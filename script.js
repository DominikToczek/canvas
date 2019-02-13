const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
const x = 0;
const y = 0;
const imageObj = new Image();
const resetBtn = document.getElementById('resetBtn');

// funkcja wczytująca wskazany obraz do obiektu canvas
document.getElementById('loadBtn').addEventListener('click', function(){
    let loadImgPath = document.getElementById('loadImgPath').value;
    imageObj.src = loadImgPath;

    imageObj.onload = function() {
        context.drawImage(imageObj, x, y);
    }
})

// funkcja resetująca wartości suwaków
resetBtn.addEventListener('click', function(){
    context.drawImage(imageObj, x, y);
    contrast.value = 0;
    brightness.value = 0;
    saturation.value = 100;
})







const brightness = document.getElementById('brightnessSlider');
const contrast = document.getElementById('contrastSlider');
const saturation = document.getElementById('saturationSlider');

// funkcja pomocnicza do zmiany kolorów
function truncate(value) {
    if (value < 0) return 0;
    if (value > 255) return 255;
    return value;
}
// funkcja zmieniająca jasność
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

// funkcja zmieniająca kontrast
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

// funkcja zmieniająca nasycenie
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

// funkcja przywracająca oryginalne kolory obrazu
function reset()
{
    context.drawImage(imageObj, x, y);
}

// funkcja zmieniająca wartość koloru RGB na HSV
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


// funkcja zmieniająca wartość koloru HSV na RGB
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






let mousedown = false;
canvas.addEventListener('mousedown', MouseDown);
canvas.addEventListener('mouseup', MouseUp);
canvas.addEventListener('mousemove', function(e) {
    let mousePosition = GetMousePosition(canvas, e);
    let x = mousePosition.x;
    let y = mousePosition.y;
    Draw(canvas, x, y);
});

function MouseDown() {
    mousedown = true;
}

function MouseUp() {
    mousedown = false;
}
// funkcja zwracająca pozycję wskaźnika myszy
function GetMousePosition(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top};
}

// funkcja rysująca po obrazie
function Draw(canvas, x, y){
    if (mousedown == true)
    {
        let brushSize = SetSize() 
        context.fillRect(x, y, brushSize, brushSize);
        SetColor();
        context.stroke();
    }
}
// funkcja ustawiająca rozmiar pędzla do rysowania
function SetSize()
{
    return parseInt(document.getElementById('sizeSlider').value);
}

// funkcja ustawiająca odpowiedni kolor do rysowania
function SetColor() {
    if (document.getElementById('radio_black').checked)
    {
        context.fillStyle = "black";
    }
    if (document.getElementById('radio_grey').checked)
    {
        context.fillStyle = "grey";
    }
    if (document.getElementById('radio_white').checked)
    {
        context.fillStyle = "white";
    }
    if (document.getElementById('radio_red').checked)
    {
        context.fillStyle = "red";
    }
    if (document.getElementById('radio_orange').checked)
    {
        context.fillStyle = "orange";
    }
    if (document.getElementById('radio_yellow').checked)
    {
        context.fillStyle = "yellow";
    }
    if (document.getElementById('radio_green').checked)
    {
        context.fillStyle = "green";
    }
    if (document.getElementById('radio_blue').checked)
    {
        context.fillStyle = "blue";
    }
    if (document.getElementById('radio_purple').checked)
    {
        context.fillStyle = "purple";
    }
}