
var LineGraph = function(options, done){

    this.container = options.container || ".js-graph-container";
    this.data = {};
    this.color_pattern = options.color_pattern || ['#000000'];
    this.point_show = options.point_show || false;

    if(options.data){
        this.data = options.data;
        this.categories = options.years;
    }
    else{
        this.categories = ['2010', '2011', '2012', '2013', '2014'];
        this.data.columns = [      
                                ['line1', 0, 10, 15, 18, 25],
                                ['line2', 0, 10, 0, -5, -10]
                            ];
    }

    this.y_min = options.y_min || undefined;
    this.y_max = options.y_max || undefined;
    this.y_step = options.y_step || 10;

    this.padding = {top: 0, bottom: 0 }; 

    this.data.type = options.type || 'spline';

    this.y_tick = { format: function (d) { return d + "%"; } };

    var get_range = function (start, end, step) {
        var myArray = [];
        for (var i = start; i <= end; i += step) {
            myArray.push(i);
        }
        return myArray;
    };
    
    if(this.y_min && this.y_max){
       this.y_tick.values = get_range(this.y_min, this.y_max, this.y_step);
    }
    

    this.render = function(){
        
        var chart = c3.generate({
            bindto: d3.select(this.container),
            padding: {
                top: 5
            },
            data: this.data,
            color: {
                pattern: this.color_pattern
            },
            point: {
                show: this.point_show
            },
            grid: {
                y: {
                    lines: [
                        {value: 0, class: 'zero-line' }
                    ]
                }
            },
            axis : {
                x : {
                    type : 'categories',
                    categories: this.categories
                },
                y : {
                    tick: this.y_tick,
                    max: this.y_max,
                    min: this.y_min,
                    padding: this.padding,
                }
            },
            legend: {
                show: false
            },
            onrendered: function(){

                // custom hacks
                var line2 = d3.select(".c3-line-line2");
                line2.attr("stroke-dasharray","10,10").attr("stroke-width",3);
                d3.select(".c3-line-line1").attr("stroke-width",3);

                var axis_path = d3.selectAll(".c3-axis path");
                axis_path.attr("stroke","#A3A375")
                         .attr("stroke-width",2);

                var get_Y = function(){
                    $(".zero-line").attr("opacity", "0");
                    return $(".zero-line").children("line").attr("y1");
                };

                var set_axis_zero = function(){
                    setTimeout(function() {
                        var y = get_Y();
                        if(y){
                          $(".c3-axis-x").attr("transform","translate(0,"+y+")");
                        }
                        else{
                            setTimeout(function() {
                                y = get_Y();
                                $(".c3-axis-x").attr("transform","translate(0,"+y+")");
                            }, 150); 
                        }
                    }, 50);
                };

                // set X axis to zero handler
                set_axis_zero();
                $(window).resize(function(){
                    set_axis_zero();
                });

            }
        });

        return this;
    };

    this.done = function(callback){
        setTimeout(function() {
            callback();
        }, 151); 
        return this;
    };

};