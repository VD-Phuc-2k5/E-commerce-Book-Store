function csvToJson(csv) {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentLine[j] ? currentLine[j].trim() : "";
    }

    result.push(obj);
  }

  return result;
}

export default csvToJson;
