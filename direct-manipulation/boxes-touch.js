var BoxesTouch = {
    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        jQueryElements
            .addClass("drawing-area")
            
            .each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startDraw, false);
                element.addEventListener("touchmove", BoxesTouch.trackDrag, false);
                element.addEventListener("touchend", BoxesTouch.endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startMove, false);
                element.addEventListener("touchend", BoxesTouch.unhighlight, false);
            });
    },

    setupDragState: function () {
        $(".drawing-area .box")
            .unbind("touchmove")
            .unbind("touchend");
    },

    startDraw: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if(!touch.target.movingBox){
                this.anchorX = touch.pageX;
                this.anchorY = touch.pageY;
                this.drawingBox = $("<div></div>") // JD: 8
                this.drawingBox // JD: 5
                    .appendTo($("#drawing-area")) // JD: 4
                    .addClass("box")
                    .offset({ left: this.anchorX, top: this.anchorY });
                // JD: 4
                $("#drawing-area").find("div.box").each(function (index, element) {
                    element.addEventListener("touchstart", BoxesTouch.startMove, false);
                    element.addEventListener("touchend", BoxesTouch.unhighlight, false);
                });

                BoxesTouch.setupDragState();
            }
        });
    },

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag:  function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (this.drawingBox) { // JD: 8
                var newOffset = {
                    left: (this.anchorX < touch.pageX) ? this.anchorX : touch.pageX,
                    top: (this.anchorY < touch.pageY) ? this.anchorY : touch.pageY
                };

                this.drawingBox
                    .offset(newOffset)
                    .width(Math.abs(touch.pageX - this.anchorX))
                    .height(Math.abs(touch.pageY - this.anchorY));                
            } else if (touch.target.movingBox) {
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
                // JD: 7
            }
        });
        
        event.preventDefault();
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (this.drawingBox) {

                this.drawingBox = null;
            } else if (touch.target.movingBox) {
                var oscar = $("#theGrouch").offset();
                var oscarEnd = oscar.left + $("#theGrouch").width();
                var oscarBottom = oscar.top + $("#theGrouch").height();

                if((touch.pageX > oscar.left) && (touch.pageX < oscarEnd) && (touch.pageY > oscar.top) && (touch.pageY < oscarBottom)){
                    touch.target.movingBox.remove();
                }
                touch.target.movingBox = null;
            }
        });
    },

    /**
     * Indicates that an element is highlighted.
     */
    highlight: function () {
        $(this).addClass("box-highlight");
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            $(touch.target).addClass("box-highlight");

            var jThis = $(touch.target),
                startOffset = jThis.offset();

            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        event.stopPropagation();
    }

};
