
var MapToImage = function (opts){

    var $container = $(opts.container) || $('#map-container');
    var $trigger = $(opts.trigger) || $("none");

    $container.children(".datamaps-hoverover").remove();

    // Canvg requires trimmed content
    var content = $container.html().trim();
    var canvas = document.getElementById('canvas');

    // Draw svg on canvas
    canvg(canvas, content);

    // Change img be SVG representation
    var theImage = canvas.toDataURL('image/png');
    $('#img1').attr('src', theImage);

    console.log($trigger);

    $trigger.attr("href", theImage)
        .attr("download", function() {
           return "world_map.png";
        });


};