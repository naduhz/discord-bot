module.exports = function SearchParameter(queryString, tags, type) {
  this.queryString = "q_all=";

  queryWords = queryString.trim().split(/ +/);
  if (queryWords.length > 1) {
    for (let i = 0; i < queryWords.length - 1; i++)
      this.queryString += `${queryWords[i]}%20`;
    this.queryString += queryWords.pop();
  } else {
    this.queryString += queryWords;
  }

  this.tags = "q_tags=";

  queryTags = tags.trim().split(/ +/);
  if (queryTags.length > 1) {
    for (let i = 0; i < queryTags.length - 1; i++)
      this.tags += `${queryTags[i]}%20`;
    this.tags += queryTags.pop();
  } else {
    this.tags += queryTags;
  }

  this.type = "q_type=";

  queryType = type.trim().split(/ +/);
  if (queryType.length > 1) {
    for (let i = 0; i < queryType.length - 1; i++)
      this.type += `${queryType[i]}%20`;
    this.type += queryType.pop();
  } else {
    this.type += queryType;
  }
};
