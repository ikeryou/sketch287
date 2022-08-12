
import { Bodies, Body, Composite, Engine, Render, Runner, Composites, Constraint } from "matter-js";
import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { MyObject3D } from "../webgl/myObject3D";

export class MatterjsMgr extends MyObject3D {

  public engine:Engine;
  public render:Render;

  private _runner:Runner;

  public lineTopBodies:Array<Body> = [];
  public lineBottomBodies:Array<Body> = [];

  public itemBodies:Array<Body> = [];

  constructor() {
    super()

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    // エンジン
    this.engine = Engine.create();
    this.engine.gravity.x = 0;
    this.engine.gravity.y = 0;

    // レンダラー
    this.render = Render.create({
      element: document.body,
      engine: this.engine,
      options: {
        width: sw,
        height: sh,
        showAngleIndicator: false,
        showCollisions: false,
        showVelocity: false,
        pixelRatio:Conf.instance.FLG_SHOW_MATTERJS ? 1 : 0.1
      }
    });
    this.render.canvas.classList.add('l-matter');

    this._makeLine(true);
    this._makeLine(false);

    for(let i = 0; i < Conf.instance.TEXT_NUM; i++) {
      const mouseSize = sw * Func.instance.val(0.4, 0.1);
      const item:Body = Bodies.circle(0, 0, mouseSize, {isStatic:true, friction:0.01, restitution:0.5, render:{visible: Conf.instance.FLG_SHOW_MATTERJS}});
      Composite.add(this.engine.world, [
        item,
      ]);
      Body.setPosition(item, {x:9999, y:9999});
      this.itemBodies.push(item);
    }

    this._runner = Runner.create();
    this.start();
    this._resize();
  }


  private _makeLine(isTop:boolean): void {
    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    const stiffness = 0.02;
    const bridgeNum = 15;
    const bridgeSize = (sw / bridgeNum) * 0.5;
    const baseY = isTop ? sh * -0.1 : sh * 1.1;

    const bridge = Composites.stack(0, 0, bridgeNum, 1, 0, 0, (x:number, y:number) => {
      return Bodies.circle(x, y, bridgeSize, {
        collisionFilter: { group: Body.nextGroup(true) },
        density: 0.05,
        frictionAir: 0.1,
        render: {
          fillStyle: '#060a19',
          visible: Conf.instance.FLG_SHOW_MATTERJS
        }
      });
    });

    Composites.chain(bridge, 0, 0, 0, 0, {
      stiffness: stiffness,
      length: 0,
      render: {
        visible: Conf.instance.FLG_SHOW_MATTERJS
      }
    });

    Composite.add(this.engine.world, [
      bridge,
      Constraint.create({
          pointA: { x: 0, y: baseY },
          bodyB: bridge.bodies[0],
          pointB: { x: 0, y: 0 },
          length: 2,
          stiffness: 1
      }),
      Constraint.create({
          pointA: { x: sw, y: baseY },
          bodyB: bridge.bodies[bridge.bodies.length - 1],
          pointB: { x: 0, y: 0 },
          length: 2,
          stiffness: 1
      })
    ]);

    // Bodyだけ入れておく
    bridge.bodies.forEach((b) => {
      isTop ? this.lineTopBodies.push(b) : this.lineBottomBodies.push(b);
    })
  }


  public start(): void {
    Render.run(this.render);
    Runner.run(this._runner, this.engine);
  }


  public stop(): void {
    Render.stop(this.render);
    Runner.stop(this._runner);
  }




  // ---------------------------------
  // 更新
  // ---------------------------------
  protected _update():void {
    super._update();
  }


  protected _resize(): void {
    super._resize();

    const sw = Func.instance.sw();
    const sh = Func.instance.sh();

    this.render.canvas.width = sw;
    this.render.canvas.height = sh;
  }
}