var styles;
var createChartImages = function(opts) {
   // Zoom! Enhance!
   // $('#chart > svg').attr('transform', 'scale(2)');

   var container = opts.container || ".js-graph-container";

   // Remove all defs, which botch PNG output
   $('defs').remove();
   // Copy CSS styles to Canvas
   inlineAllStyles();
   // Create PNG image
   var canvas = $('#canvas').empty()[0];
   canvas.width = $(container).width(); //* 2;
   canvas.height = $(container).height(); //* 2;

   var canvasContext = canvas.getContext('2d');

   var svg = $.trim($(container).children("svg")[0].outerHTML);
   canvasContext.drawSvg(svg, 0, 0);

    if (opts.get_link) {
        return canvas.toDataURL("png");
    }
    else{
        $(".js-save.png").attr("href", canvas.toDataURL("png")).attr("download", function() {
            return "line_graph.png";
       });
    }

   // $(".js-save.jpg").attr("href", canvas.toDataURL("image/jpeg",1.0))
   //     .attr("download", function() {
   //         return "line_graph.jpeg";
   //     });


};
var inlineAllStyles = function() {
   var chartStyle, selector;
   // Get rules from c3.css
   for (var i = 0; i <= document.styleSheets.length-1; i++) {
       if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf('c3.css') !== -1) {
           if (document.styleSheets[i].rules !== undefined) {
               chartStyle = document.styleSheets[i].rules;
           } else {
               chartStyle = document.styleSheets[i].cssRules;
           }
       }
   }
   if (chartStyle !== null && chartStyle !== undefined) {
       // SVG doesn't use CSS visibility and opacity is an attribute, not a style property. Change hidden stuff to "display: none"
       var changeToDisplay = function() {
           if ($(this).css('visibility') === 'hidden' || $(this).css('opacity') === '0') {
               $(this).css('display', 'none');
           }
       };
       // Inline apply all the CSS rules as inline
       for (i = 0; i < chartStyle.length; i++) {

           if (chartStyle[i].type === 1) {
               selector = chartStyle[i].selectorText;
               styles = makeStyleObject(chartStyle[i]);
               $('svg *').each(changeToDisplay);
               // $(selector).hide();
               $(selector).not($('.c3-chart path')).css(styles);
           }
           $('.c3-chart path')
               .filter(function() {
                   return $(this).css('fill') === 'none';
               })
               .attr('fill', 'none');

           $('.c3-chart path')
               .filter(function() {
                   return !$(this).css('fill') === 'none';
               })
               .attr('fill', function() {
                   return $(this).css('fill');
               });

       }
   }
};
// Create an object containing all the CSS styles.
// TODO move into inlineAllStyles
var makeStyleObject = function(rule) {
   var styleDec = rule.style;
   var output = {};
   var s;
   for (s = 0; s < styleDec.length; s++) {
       output[styleDec[s]] = styleDec[styleDec[s]];
   }
   return output;
};