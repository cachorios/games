!function ($) {
    "use strict"

    var jugadorX = 0, jugadorY = 0;
    var max_x = 36, max_y = 22, max_food = 12 , max_block = 12;
    var puntos = 0, food = 0, nivel = 1, tiempo = 30 , max_tiempo = 30;
    var timer;
    var ph = new Array();
    $.fn.objeto = function (parametro) {
        return this.each(function () {
//            var $this = $(this), data = $this.data('objeto'),
//                opciones = typeof parametro == 'object' ? parametro : {},
//                accion = typeof parametro == 'object' ? parametro.accion :parametro;
//
//
//            alert("aaa");
//            if(!data){
//                $this.data('objeto', ( data = new Objeto(this, opciones)) );
//            }
//
//            if(accion == 'add')
//                data.add();

        });
    };

    var Objeto = function ($contenedor, opciones) {
        this.$contenedor = $contenedor;
        this.opciones = $.extend({}, $.fn.objeto.defaults, opciones);

    };

    Objeto.prototype = {
        contructor: Objeto,
        add: function (pos) {
            var html = $("<div id=\"" + pos + "\" class=\"" + this.opciones.class + "\">&nbsp;</div>");
            html.data("objeto", this);
            this.$contenedor.append(html);
        },
        set: function (pos) {
            var html = $("#" + pos), obj;
            obj = html.data('objeto');
            html.removeClass(obj.opciones.class);
            html.data("objeto", this);
            html.addClass(this.opciones.class);
        },
        move: function (pos, toPos) {
            var html = $("#" + toPos), obj, nRet = 0;
            var objJug = $("#" + pos).data('objeto');
            obj = html.data('objeto');

            if (obj.opciones.tipo != "Pared") { //Puedo avanzar o comer
                nRet = 1; //movio de lugar
                if (obj.opciones.tipo == "Alimento") nRet = 2;

                obj.opciones = objJug.opciones;
                obj.set(toPos);

                html = $("#" + pos);
                obj = html.data('objeto');
                html.removeClass();
                obj.opciones = {tipo: 'libre', class: 'empty'};
                obj.set(pos);
                return nRet;
            }
            return nRet;
        }
    }
    $.fn.objeto.defaults = { tipo: 'libre', class: 'empty' }

    var num_azar = function (n) {
        return Math.floor((Math.random() * n) + 1)
    }

    var getTipo = function (pos) {
        var html = $("#" + pos), obj;
        obj = html.data('objeto');
        return obj.opciones.tipo;
    }

    var refreshCounter = function () {
        $("#puntos").html(puntos);
        $("#nivel").html(nivel);
        $("#tiempo").html(tiempo);
        $("#food").html(food);
        $("#tiempo_max").html(max_tiempo);

    }

    var Pantalla = function () {
        var a, i = 0, n = 0;
        while (i++ < max_x * max_y) {
            a = new Objeto($("#pantalla"));
            a.add(i);
        }
        i = 0;

        while (i++ < max_food) {
            a = new Objeto($("#pantalla"), {tipo: 'Alimento', class: 'alimento alimento' + num_azar(4)});
            n = num_azar(max_x * max_y);
            while (getTipo(n) != 'libre') { //Buscar una posicion libre
                n = num_azar(max_x * max_y);
            }
            a.set(n);
        }

        i = 0;
        while (i++ < max_block) {
            a = new Objeto($("#pantalla"), {tipo: 'Pared', class: 'pared'});
            n = num_azar(max_x * max_y);
            while (getTipo(n) != 'libre') { //Buscar una posicion libre
                n = num_azar(max_x * max_y);
            }
            a.set(n);
        }

        a = new Objeto($("#pantalla"), {tipo: 'Jugador', class: 'jugador'});
        jugadorX = num_azar(max_x);
        jugadorY = num_azar(max_y);
        while (getTipo((jugadorY - 1) * max_x + jugadorX) != 'libre') { //Buscar una posicion libre
            jugadorX = num_azar(max_x);
            jugadorY = num_azar(max_y);
        }
        a.set((jugadorY - 1) * max_x + jugadorX);

    }

    var getPos = function (x, y) {
        return (y - 1) * (max_x + x)
    }

    var phantom = {
        pos: {x: 0, y: 0},
        activo: 1,
        posAnterior: 0,
        class: 'phan',
        velocidad: 500,
        timer: null,
        crear: function (pos) {
            var html = $("#" + pos), obj;
            var miObj = this;
            obj = html.data('objeto');
            html.removeClass(obj.opciones.class);
            html.data("objeto", this);
            html.addClass(this.opciones.class);

            this.timer = setInterval(function () {
                miObj.run();
            }, this.velocidad);
        },
        run: function () {
            var pos;
            pos = this.camino(getPos(jugadorX, jugadorY))
            this.mover(pos);
        },
        mover: function (pos) {
            //pose se trabsporma en pos.x y pos.y
          //  this.pos.x =
        },
        camino: function (toGo) {
            var pos, minPos, dist = 99999, dist2 , x, y;
            //izq
            x = this.pos.x;
            y = this.pos.y;
            x = (--x < 1 ? 1 : x);
            pos = getPos(x, y)

            if (getTipo(pos) == 'libre' && pos != this.posAnterior) {
                minPos = pos;
                dist2 = abs(toGo - pos);
                if (dist2 < dist) {
                    minPos = pos
                    dist = dist2
                }
            }
            //arriba
            x = this.pos.x;
            y = this.pos.y;
            y = (--y < 1 ? 1 : y);
            pos = getPos(x, y)
            if (getTipo(pos) == 'libre' && pos != this.posAnterior) {
                dist2 = abs(toGo - pos);
                if (dist2 < dist) {
                    minPos = pos
                    dist = dist2
                }
            }
            //derecha
            x = this.pos.x;
            y = this.pos.y;
            x = (++x >= max_x ? max_x : x);
            pos = getPos(x, y)
            if (getTipo(pos) == 'libre' && pos != this.posAnterior) {
                dist2 = abs(toGo - pos);
                if (dist2 < dist) {
                    minPos = pos
                    dist = dist2
                }
            }
            //abajo
            x = this.pos.x;
            y = this.pos.y;
            y = (++y >= max_y ? max_y : y);
            pos = getPos(x, y)
            if (getTipo(pos) == 'libre' && pos != this.posAnterior) {
                dist2 = abs(toGo - pos);
                if (dist2 < dist) {
                    minPos = pos
                    dist = dist2
                }
            }

            this.posAnterior = getPos(this.pos.x, this.pos.y);
            return minPos;
        }
    }

    var jugar = function jugar() {
        $("#pantalla").html("");

        food = max_food;

        Pantalla();

        refreshCounter();
        $('body').unbind("keydown");
        $('body').bind("keydown", function (e) {
            var code = (e.keyCode ? e.keyCode : e.which), obj, divJugador , n;
            var x = jugadorX, y = jugadorY;

            divJugador = $("#" + ((jugadorY - 1) * max_x + jugadorX));
            obj = divJugador.data('objeto');
            if (code == 37) {
                x = (--x < 1 ? 1 : x);
                obj.opciones.class = "jugador-left";
            }
            if (code == 38) {
                y = (--y < 1 ? 1 : y);
                obj.opciones.class = "jugador-top";
            }
            if (code == 39) {
                x = (++x >= max_x ? max_x : x);
                obj.opciones.class = "jugador-right";
            }
            if (code == 40) {
                y = (++y >= max_y ? max_y : y);
                obj.opciones.class = "jugador-down";
            }

            divJugador.data("objeto", obj);

            if (x != jugadorX || y != jugadorY)
                n = obj.move((jugadorY - 1) * max_x + jugadorX, (y - 1) * max_x + x)
            if (n > 0) {
                jugadorX = x;
                jugadorY = y;
                if (n == 2) {
                    food--;
                    puntos++;
                    refreshCounter();
                    if (food < 1) {
                        clearInterval(timer);
                        //alert("FELICITACIONES!!\nPaso al siguiente nivel.");
                        nivel++;
                        puntos += tiempo;
                        food = max_food;
                        if (nivel % 6 == 0) {
                            max_tiempo = parseInt(max_tiempo * (nivel < 21 ? 0.90 : 0.95));
                        }
                        tiempo = max_tiempo;
                        max_block = parseInt(max_block * 1.1);
                        jugar();
                    }
                }
            }

        });

        timer = setInterval(function () {
            myTimer()
        }, 1000);


        $('.empty').click(function (e) {
            var obj = $(this).data('objeto')
            //alert(obj.pos);
        });
    }
    $(document).ready(function (e) {
        jugar();
        $("#reinicia").click(function (e) {
            tiempo = 30;
            max_block = 12;
            nivel = 1;
            puntos = 0;

            clearInterval(timer);
            jugar();
        });

    });

    var myTimer = function () {
        tiempo--;
        refreshCounter();
        if (tiempo < 1) {
            clearInterval(timer);
            $('body').unbind("keydown");
            alert("Tiempo Finalizado!\n has PERDIDO!!");
        }
    }
}
    (window.jQuery);

