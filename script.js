const data = require("./data.json");
const fs = require("fs");

const logStream = fs.createWriteStream("log.txt", { flags: "a" });

const generateMapObject = (data, MAP_OBJECT, start_index, INDEX) => {
  if (start_index === INDEX) {
    return {};
  }
  let temp_obj = {};
  let final_obj = { ...MAP_OBJECT };

  data[start_index].forEach((element, index) => {
    if (element !== null) {
      if (!temp_obj[element]) {
        temp_obj[element] = {
          start_index: index,
          end_index: index,
          child: {},
        };
        temp_obj[element].child = generateMapObject(data,temp_obj,start_index + 1, INDEX);
      } else {
        temp_obj[element] = {
          ...temp_obj[element],
          end_index: temp_obj[element].end_index + 1,
          child : generateMapObject(data,temp_obj,start_index + 1, INDEX)
        };
      }
    }
  });

  Object.entries(temp_obj).forEach(([tempKey, tempValue]) => {
    Object.entries(final_obj).forEach(([key, value]) => {
        
      if (
        tempValue.start_index >= value.start_index &&
        tempValue.end_index <= value.end_index
      ) {
        final_obj[key].child = { ...final_obj[key].child, [tempKey]: tempValue };
      }
    });
  });

//   console.log(final_obj)cclear
//   logStream.write(JSON.stringify(final_obj, null, 2));

  //   logStream.write(JSON.stringify(temp_obj,null ,2))
  if(Object.keys(final_obj).length){
    return final_obj;
  }else{
    return temp_obj
  }
  
};

const transformData = (data, index) => {
  let MAP_OBJECT = {};
  const result = generateMapObject(data, MAP_OBJECT, 0, index);
    console.log(result)
  logStream.write(JSON.stringify(result, null, 2));
};

transformData(data, 2);

logStream.end();
