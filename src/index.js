import THREE from 'three';
import {getWorld, Loop} from 'whs';

export default function FollowComponent(targetComponent) {
  const resultComponent = class FollowComponentEnhance extends targetComponent {
    followCurve(curve, time = 1000, loop = true) {
      const gEnd = time;

      let animation = new Loop(clock => {
        const u = clock.getElapsedTime() * 1000 / gEnd,
          vec1 = curve.getPoint(u % 1),
          vec2 = curve.getPoint((u + 0.01) % 1);

        this.position.set(vec1.x, vec1.y, vec1.z);
        this.native.lookAt(vec2);
      });

      animation.start(getWorld(this.parent));

      if (loop) {
        setInterval(() => {
          animation.stop();

          animation = new Loop(clock => {
            const u = clock.getElapsedTime() * 1000 / gEnd,
              vec1 = curve.getPoint(u % 1),
              vec2 = curve.getPoint((u + 0.01) % 1);

            this.position.set(vec1.x, vec1.y, vec1.z);
            this.native.lookAt(vec2);
          });

          animation.start(getWorld(this.parent));
        }, time);
      } else {
        setTimeout(() => {
          animation.stop(getWorld(this.parent));
        }, time);
      }
    }
  }

  return resultComponent;
}
