/*
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 Usage:
 bin/eclairjs.sh examples/mllib/gradient_boosting_regression_example.js"
 */


function run(sc) {

    // Load and parse the data file.
    var datapath = "examples/data/mllib/sample_libsvm_data.txt";
    var data = MLUtils.loadLibSVMFile(sc, datapath);
    // Split the data into training and test sets (30% held out for testing)
    var splits = data.randomSplit([0.7, 0.3]);
    var trainingData = splits[0];
    var testData = splits[1];

// Train a GradientBoostedTrees model.
    // The defaultParams for Regression use SquaredError by default.
    var boostingStrategy = BoostingStrategy.defaultParams("Regression");
    boostingStrategy.setNumIterations(3); // Note: Use more iterations in practice.
    boostingStrategy.getTreeStrategy().setMaxDepth(5);
// Empty categoricalFeaturesInfo indicates all features are continuous.
    var categoricalFeaturesInfo = {};
    boostingStrategy.getTreeStrategy().setCategoricalFeaturesInfo(categoricalFeaturesInfo);

    var model = GradientBoostedTrees.train(trainingData, boostingStrategy);


    var predictionAndLabel = testData.mapToPair(function (lp, model) {
        return [model.predict(lp.getFeatures()), lp.getLabel()]
    }, [model]);


    var testMSE = predictionAndLabel.map(function (tuple2) {
            var diff = parseFloat(tuple2[0] - tuple2[1]);
            return diff * diff;
        }).reduce(function (a, b) {
            return a + b;
        }) / data.count();

    var ret = {};
    ret.testMSE = testMSE;
    ret.model = model;
    return ret;

}


/*
 check if SparkContext is defined, if it is we are being run from Unit Test
 */

if (typeof sparkContext === 'undefined') {
    var sparkConf = new SparkConf().setAppName("Gradient Boosting Regression").setMaster("local[*]");
    var sc = new SparkContext(sparkConf);
    var result = run(sc);
    print("Test Mean Squared Error: " + result.testMSE);
    print("Learned regression GBT model:\n" + result.model.toDebugString());
    // Save and load model
    result.model.save(sc, "/tmp/myGradientBoostingRegressionModel");
    var sameModel = GradientBoostedTreesModel.load(sc, "/tmp/myGradientBoostingRegressionModel");

    sc.stop();
}