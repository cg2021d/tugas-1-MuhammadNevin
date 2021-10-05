function main() {
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    /*
        A(-0.5, 0.5)
        B(0.5, 0.5)
        C(0.5, -0.5)
        D(-0.5, -0.5)
    */

    var vertices = [
        // -0.5, 0.5, 1.0, 0.0, 0.0,   // A
        // 0.5, 0.5, 1.0, 0.0, 0.0,    // B
        // 0.5, -0.5, 0.0, 1.0, 0.0,   // C
        // -0.5, -0.5, 0.0, 0.0, 1.0   // D
        // 1-10
        0.12, 0.5, 1.0, 0.64, 0,
        0.14, 0.31, 1.0, 0.64, 0,
        0.22, 0.21, 1.0, 0.64, 0,
        0.32, 0.12, 1.0, 0.64, 0,
        0.38, 0.11, 1.0, 0.64, 0,
        0.48, 0.11, 1.0, 0.64, 0,
        0.6, 0.18, 1.0, 0.64, 0,
        0.7, 0.28, 1.0, 0.64, 0,
        0.74, 0.46, 1.0, 0.64, 0,
        0.74, 0.54, 1.0, 0.64, 0,
        // 11
        0.7, 0.46, 1.0, 1.0, 0, 
        0.62, 0.48, 1.0, 1.0, 0, 
        0.66, 0.4, 1.0, 1.0, 0, 
        0.4, 0.38, 1.0, 1.0, 0, 
        0.2, 0.44, 1.0, 1.0, 0, 
        0.14, 0.5, 1.0, 1.0, 0, 
        0.2, 0.6, 1.0, 1.0, 0, 
        0.3, 0.66, 1.0, 1.0, 0, 
        0.52, 0.68, 1.0, 1.0, 0, 
        0.7, 0.6, 1.0, 1.0, 0, 
        0.74, 0.54, 1.0, 0.64, 0,
        // 0.18, 0.58, 1.0, 1.0, 0, 
        // 0.18, 0.58, 1.0, 1.0, 0, 
        // 0.18, 0.58, 1.0, 1.0, 0, 
        // 0.18, 0.58, 1.0, 1.0, 0, 
        // 0.18, 0.58, 1.0, 1.0, 0, 
        -0.12, 0.5, 1.0, 0.64, 0,
        -0.14, 0.31, 1.0, 0.64, 0,
        -0.22, 0.21, 1.0, 0.64, 0,
        -0.32, 0.12, 1.0, 0.64, 0,
        -0.38, 0.11, 1.0, 0.64, 0,
        -0.48, 0.11, 1.0, 0.64, 0,
        -0.6, 0.18, 1.0, 0.64, 0,
        -0.7, 0.28, 1.0, 0.64, 0,
        -0.74, 0.46, 1.0, 0.64, 0,
        -0.74, 0.54, 1.0, 0.64, 0,
        // 11
        -0.7, 0.46, 1.0, 1.0, 0, 
        -0.62, 0.48, 1.0, 1.0, 0, 
        -0.66, 0.4, 1.0, 1.0, 0, 
        -0.4, 0.38, 1.0, 1.0, 0, 
        -0.2, 0.44, 1.0, 1.0, 0, 
        -0.14, 0.5, 1.0, 1.0, 0, 
        -0.2, 0.6, 1.0, 1.0, 0, 
        -0.3, 0.66, 1.0, 1.0, 0, 
        -0.52, 0.68, 1.0, 1.0, 0, 
        -0.7, 0.6, 1.0, 1.0, 0, 
        -0.74, 0.54, 1.0, 0.64, 0,
    ];

    // Linked list for vertices
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uChange;

        void main() {
            gl_Position = vec4(aPosition + uChange, 1.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Preparing .exe
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    // var speedRaw = 0.0079;
    var speed = 0.0079;
    var change = 0;
    var uChange = gl.getUniformLocation(shaderProgram, "uChange");
    // var uChange = gl.getUniformLocation(program, name)

    function render() {
        /*setTimeout(function() {
            
            . . . (isi codingan)

            render();
        }, 1000 / 60);
    }

    render();
    */
		// START
        if (change >= 0.25 || change <= -0.25) {
            speed = -speed;
        }
        
        change = change + speed;
        gl.uniform1f(uChange, change);

        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 42);
		// END -> buat isi codingan setTimeout
    }

    setInterval(render, 1000 / 60);
}
