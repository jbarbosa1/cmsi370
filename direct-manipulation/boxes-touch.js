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
                this.drawingBox = $("<div></div>")
                this.drawingBox
                    .appendTo($("#drawing-area"))
                    .addClass("box")
                    .offset({ left: this.anchorX, top: this.anchorY });
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
    trackDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (this.drawingBox) {
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
