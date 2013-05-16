var M_TOP = 38, M_RIGHT = 39, M_DOWN = 40, M_LEFT = 37;
var fondo = {tipo: 'fondo', class: 'fondo'};
var food = {tipo: 'food', class: 'food'};
var block = {tipo: 'block', class: 'block'};
var max_x = 30, max_y = 18, max_block = 12, max_food = 12, max_tiempo = 30;
var tiempo, timer, foot_cnt;
var miJuego;

var num_azar = function (n) {
    return Math.floor((Math.random() * n) + 1)
}

var getContenido = function (pos) {
    var html = $("#" + pos);
    return html.attr('class');
}


function PacMan(_contenedor, aTime) {
    var jugador = null, contenedor = _contenedor,
        puntos = 0, nivel = 1,
        audio = AudioFX('snd/fondo', { formats: ['wav'], loop: true, volume: 0.2, autoplay: true });

    this.phantom = new Array();

    function getPhantom(n) {
        return this.phantom[n];
    }

    this.getPLayer = function () {
        return jugador;
    }

    var ranPos = function () {
        return num_azar(max_x * max_y)
    }
    var pantalla = function ($contenedor) {
        var i = 0, html, n;
        $contenedor.html("");
        while (i++ < max_x * max_y) {
            html = $("<div id=\"" + i + "\" class=\"" + fondo.class + "\">&nbsp;</div>");
            $contenedor.append(html);
        }

        i = 0;
        while (i++ < max_block) {
            n = num_azar(max_x * max_y);
            while (getContenido(n) != 'fondo') { //Buscar una posicion libre
                n = num_azar(max_x * max_y);
            }
            html = $("#" + n);
            html.removeClass();
            html.addClass(block.class);
        }

        i = 0;
        while (i++ < max_food) {
            n = num_azar(max_x * max_y);
            while (getContenido(n) != 'fondo') { //Buscar una posicion libre
                n = num_azar(max_x * max_y);
            }
            html = $("#" + n);
            html.removeClass();
            html.addClass(food.class + num_azar(4));
        }
    }

    this.getPos = function (x, y) {
        return (y - 1) * max_x + x;
    }

    this.getX = function (pos) {
        var vy = this.getY(pos);
        return pos - max_x * ( vy - 1);
    }
    this.getY = function (pos) {
        return Math.ceil(pos / max_x);
    }

    this.incrementarPunto = function () {
        puntos++;
        foot_cnt--;
        this.refreshCounter();
        if (puntos % 12 == 0) {
            nivel++;
            this.nivelSiguiente();
        }
    }

    this.nivelSiguiente = function () {
        //todo: mensaje
        this.iniciar()
        jugador.cargar(posicionJugador());
        tiempo = max_tiempo;
        this.refreshCounter();
    }

    this.refreshCounter = function () {
        $("#puntos").html(puntos);
        $("#nivel").html(nivel);
        $("#tiempo").html(tiempo);
        $("#food").html(foot_cnt);
        $("#tiempo_max").html(max_tiempo);

    }

    this.run = function () {
        audio.play();
        clearInterval(timer);
        timer = setInterval(function () {
            myTimer()
        }, 1000);


        $(document).unbind("keydown");
        $(document).bind("keydown", function (e) {
            var direccion = (e.keyCode ? e.keyCode : e.which);
            if (direccion == M_LEFT) {
                jugador.moveLeft();
            }
            if (direccion == M_TOP) {
                jugador.moveTop();
            }
            if (direccion == M_RIGHT) {
                jugador.moveRight();
            }
            if (direccion == M_DOWN) {
                jugador.moveDown();
            }
            //  lphantom[0].resetPos();
        });
    }

    var posicionJugador = function()
    {
        var medio = parseInt((max_x * max_y) / 2),
            posi = ranPos();
            while( !(posi >= medio && getContenido(posi) =="fondo")){
                posi = ranPos();
            }

        return posi;
    }

    this.iniciar = function () {
        pantalla($("#" + contenedor));
        tiempo = max_tiempo;
        foot_cnt = max_food;
        puntos = 0;
        nivel = 1;

        jugador.cargar(posicionJugador());
        this.phantom[0].cargar(4);
        this.phantom[1].cargar(3);
        this.phantom[2].cargar(1);
        this.refreshCounter();
        return this;
    }

    this.finalizado = function () {
        clearInterval(timer);
        $(document).unbind("keydown");
        alert("Te comieron. perdiste!!!")

    }

    this.limpiarTimer = function () {
        clearInterval(this.phantom[0].timer);
        clearInterval(this.phantom[1].timer);
        clearInterval(this.phantom[2].timer);
    }


    pantalla($("#" + contenedor));
    jugador = new Jugador(posicionJugador(), this);
    //var lphantom
    this.phantom[0] = new Phantom(4, this, {
            class_inicio: 'phanA_1',
            class_left: 'phanA_1',
            class_top: 'phanA_1',
            class_right: 'phanA_1',
            class_down: 'phanA_1'
        }
    );

    this.phantom[1] = new Phantom(3, this, {
            class_inicio: 'phanB_1',
            class_left: 'phanB_1',
            class_top: 'phanB_1',
            class_right: 'phanB_1',
            class_down: 'phanB_1'
        }
    );

    this.phantom[2] = new Phantom(1, this, {
            class_inicio: 'phanC_1',
            class_left: 'phanC_1',
            class_top: 'phanC_1',
            class_right: 'phanC_1',
            class_down: 'phanC_1'
        }
    );

    this.phantom[0].timer = setInterval(function () {
        aTime.T1()
    }, this.phantom[0].velocidad * 0.8);
    this.phantom[1].timer = setInterval(function () {
        aTime.T2()
    }, this.phantom[1].velocidad * 0.5);
    this.phantom[2].timer = setInterval(function () {
        aTime.T3()
    }, this.phantom[2].velocidad * 0.4);


    tiempo = max_tiempo;
    foot_cnt = max_food;

}

/**
 * manejo intervalos
 */

var funcTimer = function () {
    miJuego.phantom[0].run();
}

var funcTimer2 = function () {
    miJuego.phantom[1].run();
}

var funcTimer3 = function () {
    miJuego.phantom[2].run();
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


$(document).ready(function (e) {
    miJuego = new PacMan("pantalla", {T1: funcTimer, T2: funcTimer2, T3: funcTimer3});
    miJuego.run();

    $("#reinicia").click(function (e) {
        miJuego.iniciar().run();
    });

});

var myTimer = function () {
    tiempo--;
    miJuego.refreshCounter();
    if (tiempo < 1) {
        clearInterval(timer);
        miJuego.limpiarTimer();
        $(document).unbind("keydown");
        alert("Tiempo Finalizado!\n has PERDIDO!!");
    }
}

