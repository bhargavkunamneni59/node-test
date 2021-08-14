var express = require('express');
var fuzzysort = require('fuzzysort');

var router = new express.Router();

router.get('/api/findcourses', function (req, res) {
    var db = req.app.settings.db;
    var gpaScore = req.query.gpa;
    var greScore = req.query.greScore;
    var country = req.query.country;
    var courseName = req.query.courseName;

    db.table('universities')
        .select('universities.country', 'universities.minimum_gpa', 'universities.minimum_gre_score', 'courses.name')
        .innerJoin('courses', 'universities.id', '=', 'courses.university_id')
        .where(function (qb) {
            if (gpaScore) {
                qb.where('universities.minimum_gpa', '>=', gpaScore);
            }
            if (greScore) {
                qb.where('universities.minimum_gre_score', '>=', greScore);
            }

            if (country) {
                qb.where('universities.country', '=', country);
            }
        })
        .then(function (response) {
            var d = [];
            if (courseName && response.length) {
                response.forEach(function (obj) {
                    var result = fuzzysort.single(courseName, obj.name);
                    if (result && result.score > -10000) {
                        d.push(obj);
                    }
                });
            }
            res.send({data: courseName ? d : response});
        })
        .catch(function (err) {
            res.send({data: err.message});
        })
});

module.exports = router;