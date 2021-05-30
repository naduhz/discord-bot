module.exports = function SearchParameter(queryString, tags = '', type = '') {
                            this.queryString = 'q_all=';

                            queryWords = queryString.trim().split(/ +/);
                            if (queryWords.length > 1) {
                                for (let i = 0; i < (queryWords.length - 1); i++)
                                    this.queryString += `${queryWords[i]}%20`;
                                this.queryString += queryWords.pop();
                            } else {
                                this.queryString += queryWords;
                            };

                            this.tags = 'q_tags=' + tags;
                            this.type = 'q_type=' + type
                            }