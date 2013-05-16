/**
 * Created with JetBrains WebStorm.
 * User: cacho
 * Date: 14/05/13
 * Time: 21:22
 * To change this template use File | Settings | File Templates.
 */


/***************************************
 * JUGADOR
 * @param pos
 * @param parent
 *****************************************/
var  Jugador = function(pos, parent) {
    var x = 0, y = 0,
        class_inicio = 'jugador',
        class_left = 'jugador-left',    class_top = 'jugador-top',
        class_right = 'jugador-right',  class_down = 'jugador-down',
        audio = AudioFX('snd/pacman_camina', { formats: ['wav'], pool: 1, volume: 1 }),
        audio_come = AudioFX('snd/pacman_come', { formats: ['wav'], pool: 2, volume: 0.5 });

    this.getX = function(){
        return x;
    }
    this.getY = function(){
        return y;
    }
    this.setX = function(vx){
        x = vx;
    }
    this.setY = function(vy){
        y = vy;
    }
    this.getPos = function(){
        return parent.getPos(x,y);
    }

    this.moveLeft = function () {
        var lx = x - 1, pos, sClass;
        if (lx > 0) {
            pos = parent.getPos(lx, y);
            sClass = getContenido(pos);
            if (sClass == 'fondo' || sClass.substring(0, 4) == 'food') {
                this.refreshMove(parent.getPos(x, y), pos, class_left);
                x = lx;
            }
        }
    }
    this.moveTop = function () {
        var ly = y - 1, pos, sClass;
        if (ly > 0) {
            pos = parent.getPos(x, ly);
            sClass = getContenido(pos);
            if (sClass == 'fondo' || sClass.substring(0, 4) == 'food') {
                this.refreshMove(parent.getPos(x, y), pos, class_top);
                y = ly;
            }
        }
    }
    this.moveRight = function () {
        var lx = x + 1, pos, sClass;
        if (lx <= max_x ) {
            pos = parent.getPos(lx, y);
            sClass = getContenido(pos);
            if (sClass == 'fondo' || sClass.substring(0, 4) == 'food') {
                this.refreshMove(parent.getPos(x, y), pos, class_right);
                x = lx;
            }
        }
    }
    this.moveDown = function () {
        var ly = y + 1, pos, sClass;
        if (ly <= max_y) {
            pos = parent.getPos(x, ly);
            sClass = getContenido(pos);
            if (sClass == 'fondo' || sClass.substring(0, 4) == 'food') {
                this.refreshMove(parent.getPos(x, y), pos, class_down);
                y = ly;
            }
        }
    }

    this.refreshMove = function (pos, toPos, classToMove) {
        var html = $("#" + pos), _class;
        audio.play();
        html.removeClass();
        html.addClass(fondo.class);
        html = $("#" + toPos);

        _class = getContenido(toPos).substring(0, 4)
        html.removeClass();
        html.addClass(classToMove);

        if( _class.substring(0, 4) == 'food' )
            haComido();

    }

    this.cargar = function (pos) {
        var html = $("#" + pos);
        x = parent.getX(pos);
        y = parent.getY(pos);
        html.removeClass();
        html.addClass(class_inicio);
        console.log("Pos Incio Jugador", pos);
    };

    this.cargar(pos) ;


    var haComido = function(){
        audio_come.play();
        parent.incrementarPunto();
    }
}