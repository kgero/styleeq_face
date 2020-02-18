# Interface for StyleEQ demo

## Set up

Requires two other services to be running:

**stanford core nlp**

Mine's in `style-transfer-paper/style-transfer/stanford-corenlp-full-2018-10-05`.

`(base) Katys-MacBook-Pro:stanford-corenlp-full-2018-10-05 katy$ java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -port 9000 -timeout 15000`

**styleeq_demo**

Must activate the correct conda environment (mine's called `styleeq`).

Must also have the `styleeq` repo with the required data. (This data could be moved elsewhere.) Instructions for downloading the data is in the `styleeq` repo I believe.

`(styleeq) Katys-MacBook-Pro:styleeq_demo katy$ python server.py --model ../styleeq/style_models/styleeq --data ../styleeq/literary_style_data`

Takes a hot second to load this data.

Can test this using the bash scripts in `styleeq_demo`:

`(styleeq) Katys-MacBook-Pro:styleeq_demo katy$ bash fromfeatures.sh`