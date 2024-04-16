
const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = 'https://feurbdzfxgrkmupdnlxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldXJiZHpmeGdya211cGRubHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNTI0OTIsImV4cCI6MjAyNjkyODQ5Mn0.h0DX3G2WFGTp1W1F_K5K4FLFiDYpirRDV_HZU5kmMLI';
const supabase = createClient(supabaseUrl, supabaseKey);

const tableName = 'boxInfo';
const filePath = './collectionbox.geojson';
const desiredProperties = ['ADDR_NEW', 'VALUE_01','COORD_X', 'COORD_Y', 'TEL_NO', 'VALUE_04', 'SUB_NAME']

const fs = require('fs');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const filteredData = data.features.map((feature) => {
  const filteredFeature = {}; 
  desiredProperties.forEach(property => {
    filteredFeature[property] = feature.properties[property];
  });
  return filteredFeature;
});

async function insertData() {

  try{
    for(const feature of filteredData){
      const {data : insertData, error} = await supabase.from(tableName).insert(feature);
      if(error){
        console.error('데이터 삽입 오류',error);
      }else{
        console.log('데이터 삽입 완료!', insertData);
      }
    }
  }catch(e){
    console.error('데이터 삽입 오류',e);
  }
}

insertData();
