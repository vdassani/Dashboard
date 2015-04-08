function buildIt(priority, short, rect, value, val_loc, per_loc, suffix, target, tar_loc, vs, chart, yLabel) {
    var margin = {
            top: 10,
            right: 5,
            bottom: 25,
            left: 25
        },
        width = 280 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom,
        parseDate = d3.time.format("%d-%b-%y").parse,
        x,
        y,
        xAxis,
        yAxis,
        line,
        colour,
        d3Chart,
        diff,
        prefix = "";

    d3.csv("./data/d3data.csv", function (error, data) {
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.weight = +d.weight;
            d.cesarean = +(d.cesarean * 100);
            d.stillborn = +(d.stillborn * 100);
            d.cong = +(d.cong * 100);
            d.pop = +d.pop;
        });
        x = d3.time.scale()
            .range([0, width]);

        y = d3.scale.linear()
            .range([height, 0]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        d3Chart = d3.select(chart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function checkShort() {
            line = d3.svg.line()
                .x(function (d) {
                    return x(d.date);
                });
            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));

            if (short === "bw") {
                line.y(function (d) {
                    return y(d.weight);
                });
                y.domain([3.6, 3.8]);
            } else if (short === "sr") {
                line.y(function (d) {
                    return y(d.stillborn);
                });
                y.domain([0, 1.4]);
            } else if (short === "cr") {
                line.y(function (d) {
                    return y(d.cesarean);
                });
                y.domain([17.5, 30]);
            } else if (short === "pop") {
                line.y(function (d) {
                    return y(d.pop);
                });
                y.domain([7000, 9000]);
            } else if (short === "cd") {
                line.y(function (d) {
                    return y(d.cong);
                });
                y.domain([0.15, 0.5]);
            }
        }

        checkShort();

        d3Chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("x", "100")
            .attr("y", "23")
            .style("font-size", "10px")
            .text("Month/Yr");

        d3Chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("x", "3")
            .attr("y", "2")
            .style("font-size", "10px")
            .text(yLabel);

        d3Chart.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", "white");

    });

    function d3checks() {
        if (priority === false) {
            colour = "#1B3277";
        } else {
            if (target < 10) {
                target = target.toFixed(2);
            }

            if (short === "bw") {
                diff = ((value - target) / target) * 100;
            } else {
                diff = (value - target);
            }

            diff = +(Math.round(diff + "e+2") + "e-2");

            if (diff > 0) {
                prefix = "+";
            }

            if (short === "bw") {
                if (diff > 10) {
                    colour = "red";
                } else if (diff < 0) {
                    colour = "green";
                } else {
                    colour = "orange";
                }
            } else if (short === "cr" || short === "sr") {
                if (diff > 0) {
                    colour = "red";
                } else {
                    colour = "green";
                }
            }
            d3.select(per_loc)
                .attr("fill", "white")
                .text(prefix + diff + "%");

            d3.select(tar_loc)
                .attr("fill", "white")
                .text("Target: " + target + suffix);

            d3.select(vs)
                .attr("fill", "white")
                .text("vs. target");
        }
    }

    d3checks();

    d3.select(val_loc)
        .attr("fill", "white")
        .text(value + suffix);

    d3.select(rect)
        .attr("fill", colour);
}
