const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    const x = 0;
    const y = 0;

    const imageObj = new Image();
    

    const brightness = document.getElementById('brightnessSlider');
    const contrast = document.getElementById('contrastSlider');
    const saturation = document.getElementById('saturationSlider');

    function truncate(value) {
        if (value < 0) return 0;
        if (value > 255) return 255;
        return value;
    }
    brightness.addEventListener('change', function(){
        reset();
        let imgData = context.getImageData(x, y, imageObj.width, imageObj.height);
        let data = imgData.data;
        for (let i = 0; i < data.length; i += 4)
        {
            data[i] += 255 * (brightness.value / 100)
            data[i+1] += 255 * (brightness.value / 100)
            data[i+2] += 255 * (brightness.value / 100)
        }
        context.putImageData(imgData, x, y);
        saturation.value = 100;
        contrast.value = 0;
    })

    contrast.addEventListener('change', function(){
        reset();
        let imgData = context.getImageData(x, y, imageObj.width, imageObj.height);
        let data = imgData.data;
        let factor = (259.0 * (parseInt(contrast.value) + 255.0)) / (255.0 * (259.0 - parseInt(contrast.value)));
        for (let i = 0; i < data.length; i += 4)
        {
            data[i] = truncate(factor * (data[i] - 128.0) + 128.0);
            data[i+1] = truncate(factor * (data[i+1] - 128.0) + 128.0);
            data[i+2] = truncate(factor * (data[i+2] - 128.0) + 128.0);
        }
        context.putImageData(imgData, x, y);
        saturation.value = 100;
        brightness.value = 0;
    })

    saturation.addEventListener('change', function(){
        reset();
        let imgData = context.getImageData(x, y, imageObj.width, imageObj.height);
        let data = imgData.data;
        for (let i = 0; i < data.length; i += 4)
        {
            let color = [data[i], data[i+1], data[i+2]]
            let hsv = RGBtoHSV(color);
            hsv[1] *= parseInt(saturation.value)/100;
            let rgb = HSVtoRGB(hsv);
            data[i] = rgb[0];
            data[i+1] = rgb[1];
            data[i+2] = rgb[2];
        }
        context.putImageData(imgData, x, y);
        contrast.value = 0;
        brightness.value = 0;
    })

    function reset()
    {
        context.drawImage(imageObj, x, y);
    }

    function RGBtoHSV(color) {
        var r,g,b,h,s,v;
        r= color[0];
        g= color[1];
        b= color[2];
        min = Math.min( r, g, b );
        max = Math.max( r, g, b );


        v = max;
        delta = max - min;
        if( max != 0 )
            s = delta / max;
        else {
            s = 0;
            h = -1;
            return [h, s, undefined];
        }
        if( r === max )
            h = ( g - b ) / delta;
        else if( g === max )
            h = 2 + ( b - r ) / delta;
        else
            h = 4 + ( r - g ) / delta;
        h *= 60;
        if( h < 0 )
            h += 360;
        if ( isNaN(h) )
            h = 0;
        return [h,s,v];
    }

    HSVtoRGB= function(color) {
        var i;
        var h,s,v,r,g,b;
        h= color[0];
        s= color[1];
        v= color[2];
        if(s === 0 ) {
            r = g = b = v;
            return [r,g,b];
        }
        h /= 60;
        i = Math.floor( h );
        f = h - i;
        p = v * ( 1 - s );
        q = v * ( 1 - s * f );
        t = v * ( 1 - s * ( 1 - f ) );
        switch( i ) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            default:
                r = v;
                g = p;
                b = q;
                break;
        }
        return [r,g,b];
    }
    
    imageObj.onload = function() {
        context.drawImage(imageObj, x, y);
    }

    imageObj.src = 'img.jpg';

    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', function(){
        context.drawImage(imageObj, x, y);
        contrast.value = 0;
        brightness.value = 0;
        saturation.value = 100;
    })