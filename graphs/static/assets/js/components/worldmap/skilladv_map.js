function skilladvMap(opts){

    var dataLink = opts.source;

    var height = (opts.height)? opts.height : 500, 
        width = (opts.width)? opts.width : 700, 
        active = null, 
        centered, 
        buckets, 
        countriesDict,  
        currYear,
        otherYear;

    var currProp = "skillCountry";

    var toggleTooltips = (opts.tooltips == "no") ? false : true;

    countryFocus = (opts.country_focus == "no")? "no":"yes";

        var propAttributes = {
            "skillCountry":{
                title: "Top skills in {title}",
                mouseover: "{country}"
            },
            "skillSkill":{
                title: "Top skills in {title}",
                mouseover: "{country}"
            },
            "skillTable":{
                title: "Top skills in {title}",
                mouseover: "{country}"
            }

        };

        // $(document).ready(function() {          
            // Setting the mode (Europe/World) from URL        
            var currentURL = $(location).attr("href");
            var a = $('<a>', { href:currentURL } )[0];
            var defaultFill = (opts.default_fill)? opts.default_fill : "#D6D6D6";
            var borderWidth = (opts.border_width)? opts.border_width : 0.2;
            var borderColor = (opts.border_color)? opts.border_color : '#FDFDFD';
            mapObject = {

                element : document.getElementById('map-container'),
                projection:"mercator",
                fills : {
                    defaultFill : defaultFill
                },
                geographyConfig: {
                    hideAntarctica: true,
                    borderWidth: borderWidth,
                    borderColor: borderColor

                }
            };

            if(countryFocus=="yes" ){
                delete mapObject["projection"];
                mapObject["setProjection"]= function(element) {
                                                var width = element.offsetWidth;
                                                var height = element.offsetHeight;
                                                var projection = d3.geo.mercator()
                                                  .center([15, -15])
                                                  .rotate([4.4, 0])
                                                  .scale((width + 1) / 2 / Math.PI)
                                                  .translate([width / 2, height / 1.45]);
                                                var path = d3.geo.path()
                                                  .projection(projection);

                                                return {path: path, projection: projection};
                                            };
            }

            // highlight on hover over country
            if(toggleTooltips === false){
                mapObject.geographyConfig["highlightOnHover"] = false;
            }
            else{
                mapObject.geographyConfig["highlightFillColor"] = '#0099e6';
                mapObject.geographyConfig["highlightBorderColor"] = '#0088cc';
                mapObject.geographyConfig["highlightBorderWidth"] = 0.4;
            }

//            if( opts.thumbs == "yes" ){
//                delete mapObject["projection"];
//                mapObject["projection"] == "equirectangular";
//            }

            // Creating the map with FINAL options
            map = new Datamap(mapObject);

                
            // Attaching the country click event
            d3.selectAll("path").on("click", clicked);

            $("#years-patents").hide();
            // trigger of views

        if (countryFocus == "no"){

            $("#prop_toggle a").click(function(e) {
                e.preventDefault();
                if ($(this).text() == "Skills") {
                    // setting up current property and year
                    currProp = "skillSkill";
                    updateCountryColor("skillSkill");
                }
                if ($(this).text() == "Country") {
                    // setting up current property and year
                    currProp = "skillCountry";
                    updateCountryColor("skillCountry");
                }


                $("#prop_toggle a").removeClass("primary").removeClass("btn-primary");
                $(this).addClass("primary").addClass("btn-primary");

                $("#curr-prop").text($(this).text());


                // toggleTitles(currProp);

            });

        }
        if(countryFocus == "yes"){
            $(document).ready(function () {
                currProp = "skillTable";
            });
        }

        if(opts.tooltips === true){
            toggleMapTooltips(true);
        }
        else{
            toggleMapTooltips(false);
        }

            $("#back-to-map").click(function(e) {
                reset();
            });


                            
        if(countryFocus=="no"){
            d3.json(bucketsFile, function(error, data) {
                buckets = data;

                $(".loading-map-state").show();
                d3.json(dataLink, function(error, data) {
                    countriesDict = data;

                    init();
                    // on load of data trigger first property in list
                    $("#prop_toggle a").first().trigger("click")
                    reset();

                    $(".loading-map-state").hide();
                });

            });
        }
        if(countryFocus=="yes"){
            $.ajax({
                url: countryDataUrl+"0",
                beforeSend: function(){
                    $(".loading-map-state").show();
                }
            }).done(function(data){
                countriesDict = data;

                init();
                reset();

                $(".loading-map-state").hide();
            });
        };
            


        // });

        function toggleView(newViewType) {
        if (newViewType == "map") {
            if ( currProp == "skillCountry" || "skillSkill" ){

                $(".mapview").show(750);
                $(".countryview").hide(750);

            }
            else{
                $(".mapview").show(750)
                $(".chartview").hide();
                if (currProp.indexOf("stem") > -1)
                    $("#years-stem").show(750)
                else if (currProp.indexOf("patents") > -1)
                    $("#years-patents").show(750)
                else
                    $("#sub-types").show(750)
            }

        } else {
            if ( currProp == "skillCountry" || "skillSkill" ){
                $(".countryview").show(750);
                $(".mapview").hide(750);
            }
            else{
                $(".mapview").hide(750);
                $(".chartview").show(750);
                $("#years-patents").hide(750);
                $("#years-stem").hide(750);
                $("#sub-types").hide(750);
            }
            
        }
        }

        // function setCurrYearName() {
        //  if (currProp.indexOf("sub") > -1) { // special case - subsidiaries
        //      if (currYear.indexOf("Foreign")>-1) {
        //          currYearName = "Foreign";
        //          otherYearName = "Bay Area";
        //      } else {
        //          currYearName = "Bay Area";
        //          otherYearName = "Foreign";
        //      }
        //  } else {
        //      currYearName = currYear;
        //      otherYearName = null;
        //  }
        // }

        // function toggleTitles(prop) {
        //  setCurrYearName()
        //  var title = propAttributes[prop].title.replace(/{currYear}/g,
        //          currYearName).replace(/{otherYear}/g, otherYearName)
        //  $("#curr-prop-map-title").text(title)
        // }

        function toggleMapTooltips(enableTooltips) {
        if (enableTooltips) {
            map.options.geographyConfig.popupTemplate = function(geo, data) {


                var name = geo.properties.name;
                var additionalHover = "";
                var flagPlaceholder = "";
                var value;
                var percLabel;
                if (countryFocus == "no"){

                    var values = geo.properties.values || { v1:0, v2:0 };
                    value = (currProp == "skillCountry")? values.v2 : values.v1;
                    valueF = value.toFixed(2) + "%";
                    percLabel = (currProp == "skillCountry")? "compared to countries" : "compared to skill";

//                    additionalHover = '<tr>'+
//                                        '<td>'+
//                                        '</td>'+
//                                        '<td class="additional-td">'+
//                                             percLabel + ': ' + '<strong>' + valueF + '</strong>' +
//                                        '</td>'+
//                                      '</tr>';

                };
                if (countryFocus == "yes"){

                    skill = geo.properties.main_skill;
                    value = (skill)? skill.skill : "";
                    additionalHover = '<tr>'+
                                        '<td>'+
                                        '</td>'+
                                        '<td class="additional-td">'+
                                            '<strong>' + value + '</strong>' +
                                        '</td>'+
                                      '</tr>';

                };

                flagIcon = geo.properties.flag_icon;

                if (flagIcon){
                    flagPlaceholder = '<img class="country_flag" src="'+ flagsUrl + "/" + flagIcon +'"/>'
                }


                var display_name = (geo.properties.display_name) ? geo.properties.display_name : name;


                return  [   '<div class="hoverinfo">',
                                '<table>',
                                    '<tbody>',
                                        '<tr>',
                                            '<td class="flag-td">',
                                                flagPlaceholder,
                                            '</td>',
                                            '<td class="country-name-td">',
                                                propAttributes[currProp].mouseover,
                                            '</td>',
                                        '</tr>',
                                        additionalHover,
                                    '</tbody>',
                                '</table>',
                             '</div>'
                ].join('').replace(/{country}/, display_name);

            }
        } else {
            map.options.geographyConfig.popupTemplate = function(geo, data) {
            };
        }

        }

        function clicked(d) {

            if(countryFocus == "yes"){
                var newWidth = width / 4;
                var newHeight = height / 4;
                var name;
                var bounds;


                name = d.properties.name;
                flagIcon = d.properties.flag_icon;
                var path = map.path;
                bounds = path.bounds(d);

                if (active == name)
                    return reset();

                active = name;

                $('.datamaps-subunit').not(this).hide(1000);

                toggleView("chart");
                toggleMapTooltips(false);

                var dx = bounds[1][0] - bounds[0][0], 
                  dy = bounds[1][1] - bounds[0][1], 
                  x = (bounds[0][0] + bounds[1][0]) / 2,
                  y = (bounds[0][1] + bounds[1][1]) / 2,
                  scale = 3 / Math.max(dx / newWidth, dy / newHeight), 
                  translate = [newWidth / 2 - scale * x + 180, newHeight / 2 - scale * y + 140];

                map.svg.transition().duration(750).call(
                        zoom.translate(translate).scale(scale).event);

                $(".country-name").text(name);
                if(flagIcon){
                    $(".country-flag").html('<img class="countryview-flag" src="'+ flagsUrl + "/" + flagIcon +'" />');
                }
                $("#skills-table table tbody").html("");
                createSkillTable(name);

            }
            if(countryFocus == "no"){

                window.location.href = countryUrl+d.properties.display_name+"/";

            };

        }

        function updateCountryColor(prop) {
            prop = ( prop == "skillCountry") ? "v2" : "v1";
            map.svg.selectAll('.datamaps-subunit').each(
                function(d) {
                    var name = d.properties.name;

                    var val = (countriesDict[name])? countriesDict[name] : "";

                    if (val && val[prop]) {
                        var color = d.properties.colors[prop]

                    } else {
                        color = defaultFill;
                    }

                    map.svg.select("." + d.id).transition("750").style(
                            "fill", color);

            })

            // updating legend
            // $("#legend").empty();
            // if(propColors[prop]){
            //  colorlegend("#legend", propColors[prop], "quantile", {boxWidth: "135"});
            // }
        }

        function zoomed() {
            var g = d3.select(".datamaps-subunits")
            g.style("stroke-width", 1.5 / d3.event.scale + "px");
            g.attr("transform", "translate(" + d3.event.translate + ")scale("
                    + d3.event.scale + ")");
        }

        function reset() {
            //active.classed("active", false);
            active = null;
            $('.datamaps-subunit').show(750);
            $('.nv-multiBarWithLegend').fadeOut(500, function() {
                $(this).remove()
            });


                map.svg.transition().duration(750).call(
                    zoom.translate([ 0, 0 ]).scale(1).event);

            toggleView("map");


            toggleMapTooltips(toggleTooltips);

            if(countryFocus=="yes"){
                $("#skills-table").hide();
            }
//            $(".chart svg").empty()
        }

        function init() {

            // console.log(colorbrewer);

            if(countryFocus=="no"){
                var props = ["skillCountry", "skillSkill" ];
                propColors = {};

                //different colors
                props.map(function(prop) {


                    if (prop.indexOf("skillCountry") > -1){
                        colorVals = colorbrewer.Oranges[9];
                    }
                    else if (prop.indexOf("skillSkill") > -1) {
                        colorVals = colorbrewer.Blues[9];
                    }

                    if (opts.custom_colors){
                        colorVals = opts.custom_colors;
                    }

                    propColors[prop] = d3.scale.linear().domain(buckets[prop]).range(colorVals.slice(colorVals.length - buckets[prop].length));
                    // console.log(colorVals.slice(colorVals.length - buckets[prop].length));


                });
            }


            zoom = d3.behavior.zoom().translate([ 0, 0 ]).scale(1).scaleExtent(
                    [ 1, 8 ]).on("zoom", zoomed);


            map.svg.call(zoom) // delete this line to disable free zooming
             .call(zoom.event);

            // Calculating the bounds of Europe
            eurBounds = [ [ Infinity, Infinity ], [ -Infinity, -Infinity ] ]
            map.svg
              .selectAll('.datamaps-subunit')
              .each(
                    function(d) {
                        var name = d.properties.name;

                        var val = countriesDict[name];

                        
                        // if (d.id.indexOf("-") > -1)
                        //     return;
                        
                        if (val && countryFocus=="no") {
                            d.properties.colors = {}
                            d.properties.values = {}

                            
                            for (prop in propColors) {
                                var item = (prop == "skillCountry") ? "v2" : "v1";
                                
                                d.properties.colors[item] = propColors[prop]
                                        (val[item])
                                d.properties.values[item] = val[item]
                                d.properties["display_name"] = val["n"];
                                // console.log(d.properties, val["n"])
                            }
                            
                        }
                        else if (val && countryFocus=="yes") {
                            d.properties["country_id"] = val["country_id"]
                            d.properties["display_name"] = val["display_name"];
                            d.properties["main_skill"] = { "skill":val["skill"], "skill_id":val["skill_id"], "skill_url":val["skill_url"] }

                            color = "#D6D6D6";
                        }
                        else {
                            color = "#D6D6D6";
                        };

                        if (val){
                            d.properties["flag_icon"] = val["flag"];
                        }
                        


            });

        };

        function createSkillTable(country){
            singleCountry = (countriesDict[country])? countriesDict[country] : false;

            if (singleCountry){
                var skills;
                $.ajax({
                    url: countryDataUrl+singleCountry.country_id,
                    beforeSend: function(){
                        $(".loading-map-state").show();
                    }
                }).done(function(data){
                    skills = data;
                    $(".loading-map-state").hide();

                    if(skills){
                        fillTable(skills);
                    };
                });

                function fillTable(skills) {
                    skills = skills.sort(function (a, b) {
                        return a.r - b.r
                    });

                    $(skills).each(function (i, val) {
                        skill = val;
                        $("#skills-table table tbody").append(  '<tr>'+
                                                                    '<td>'+
                                                                        skill.skill+
                                                                    '</td>'+
                                                                    '<td>'+
                                                                        skill.n+
                                                                    '</td>'+
                                                                '<tr>'  );
                    });
                    $("#skills-table").show();
                };
            }
        };

};