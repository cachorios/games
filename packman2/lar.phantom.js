/**
 * Created with JetBrains WebStorm.
 * User: cacho
 * Date: 14/05/13
 * Time: 21:26
 * To change this template use File | Settings | File Templates.
 */
/******************************************************************
 * P H A N T O M
 * @param pos
 * @param parent
 * @param opciones
 * @constructor
 */
function Phantom(pos, parent, opciones) {
    var x = 0, y = 0,
        class_inicio = 'phanA',
        class_left = 'phanA', class_top = 'phanA',
        class_right = 'phanA', class_down = 'phanA',
        audio = AudioFX('snd/pacman_camina', { formats: ['wav'], pool: 1, volume: 0.8 }),
        audio_come = AudioFX('snd/pacman_death', { formats: ['wav'], pool: 2, volume: 0.5 }),
        activo = 1, posAnterior = 0, class_anterior = fondo.class;
    this.velocidad = 800;
    this.timer = null;

    //    this.superConstructor = Jugador;
    //    this.superConstructor(pos, parent,opciones);

    this.resetPos = function () {
        posAnterior = 0;
    }

    if (typeof opciones != 'undefined') {
        class_inicio = opciones.class_inicio ? opciones.class_inicio : class_inicio;
        class_left = opciones.class_left ? opciones.class_left : class_left;
        class_top = opciones.class_top ? opciones.class_top : class_top;
        class_right = opciones.class_right ? opciones.class_right : class_right;
        class_down = opciones.class_down ? opciones.class_down : class_down;
    }

    this.getX = function () {
        return x;
    }
    this.getY = function () {
        return y;
    }
    this.setX = function (vx) {
        x = vx;
    }
    this.setY = function (vy) {
        y = vy;
    }

    this.getPos = function () {
        return parent.getPos(x, y);
    }

    this.getClass = function (n) {
        var nClass;
        switch (n) {
            case 0:
                nClass = class_inicio;
                break;
            case 1:
                nClass = class_left;
                break;
            case 2:
                nClass = class_top;
                break;
            case 3:
                nClass = class_right;
                break;
            case 4:
                nClass = class_down;
                break;
        }
        return nClass;
    }


    this.camino = function (toGoX, toGoY) {
        var pos, posAct, minPos, dist = 99999, dist2 , vx, vy;

        vx = this.getX();
        vy = this.getY();
        posAct = parent.getPos(vx, vy);

        minPos = posAct;

        vx = (vx - 1 < 1 ? 1 : vx - 1);
        pos = parent.getPos(vx, vy);
        //console.log("x y Pos ",x,y,pos);
        if (getContenido(pos) != 'block' && getContenido(pos).substr(0,4) != 'phan' && pos != posAnterior && pos != posAct) {
            dist2 = Math.abs(toGoX - vx) + Math.abs(toGoY - vy);
            if (dist2 < dist) { //|| (dist2 = dist && num_azar(2) == 1)   ) {
                minPos = pos;
                dist = dist2;
            }
        }
        //arriba
        vx = this.getX();
        vy = this.getY();

        vy = (vy - 1 < 1 ? 1 : vy -1);
        pos = parent.getPos(vx, vy);
        //console.log("x y Pos ",x,y,pos);
        if (getContenido(pos) != 'block' && getContenido(pos).substr(0,4) != 'phan' && pos != posAnterior && pos != posAct) {
            dist2 = Math.abs(toGoX - vx) + Math.abs(toGoY - vy);
            if (dist2 < dist) { // || (dist2 = dist && num_azar(2) == 1) ) {
                minPos = pos;
                dist = dist2;
            }
        }
        //derecha
        vx = this.getX();
        vy = this.getY();
        vx = (vx + 1 >= max_x ? max_x : vx + 1);
        pos = parent.getPos(vx, vy);
        //console.log("x y Pos ",x,y,pos);
        if (getContenido(pos) != 'block' && getContenido(pos).substr(0,4) != 'phan' && pos != posAnterior && pos != posAct) {
            dist2 = Math.abs(toGoX - vx) + Math.abs(toGoY - vy);
            if (dist2 < dist) {
                minPos = pos;
                dist = dist2;
            }
        }
        //abajo
        vx = this.getX();
        vy = this.getY();
        vy = (vy + 1 >= max_y ? max_y : vy + 1);
        pos = parent.getPos(vx, vy);
        //console.log("x y Pos ",x,y,pos);
        if (getContenido(pos) != 'block' && getContenido(pos).substr(0,4) != 'phan' && pos != posAnterior && pos != posAct) {
            dist2 = Math.abs(toGoX - vx) + Math.abs(toGoY - vy);
            if (dist2 < dist) {
                minPos = pos;
                dist = dist2;
            }
        }
        return minPos;
    }


    this.run = function () {
        var toPos;
        toPos = this.camino(parent.getPLayer().getX(), parent.getPLayer().getY());
        posAnterior = parent.getPos(this.getX(), this.getY())
        //if(pos != posAnterior){
            this.setX(parent.getX(toPos));
            this.setY(parent.getY(toPos));
            this.refreshMove(posAnterior, toPos, this.getClass(0));
        //}

    }

    this.refreshMove = function (pos, toPos, classToMove) {
        var html = $("#" + pos);
        var class_res;

        if(pos ==  toPos)
            return
        class_res = getContenido(toPos);

        html.removeClass();
        if (class_anterior.substr(0, 4) == 'food')
            html.addClass(class_anterior);
        else
            html.addClass(fondo.class);

        html = $("#" + toPos);
        html.removeClass();
        html.addClass(classToMove);

        if (class_res.substr(0, 7) == 'jugador') {
            ///perdio
            audio_come.play();
            parent.finalizado();
        }
        class_anterior = class_res;
    }


    this.cargar = function (pos) {
        var html = $("#" + pos);
        x = parent.getX(pos);
        y = parent.getY(pos);
        html.removeClass();
        html.addClass(class_inicio);
    };
    this.cargar(pos);
}
