const RAINDROP_TOTAL = 200;
const BACKGROUND = 'rgba(0,0,0,1)';
const RAIN_COLOR = 'rgba(119,8,236,1)';
const TOUCHED_COLOR = 'rgb(244, 66, 66)'

const rain = [];

const entities = {};
let entitiesCount = 0;

class Entity {
  constructor() {
    entitiesCount += 1;
    this.id = entitiesCount;
    this.components = {};
  }

  withComponent(component) {
    this.components[component.name] = component;
    return this;
  }

  removeComponent(component) {
    delete this.components[component.name];
    return this;
  }

  toString() {
    return JSON.stringify(this, null, 4);
  }
}

function addRaindrop() {
  const rd = new Entity();
  rd.withComponent(new PositionComponent());
  entities[rd.id] = rd;
}

class PositionComponent {
  constructor(xPos, yPos) {
    this.xPos = xPos !== undefined ? xPos : random(0, width);
    this.yPos = yPos !== undefined ? yPos : (-1 * random(0, height));

    this.maxHeight = 45;
    this.minHeight = 25;

    this.maxWidth = 4;
    this.minWidth = 1;

    this.height = random(this.minHeight, this.maxHeight);
    this.width = random(this.minWidth, this.minWidth);

    this.skew = 0;

    this.backgroundColor = RAIN_COLOR;

    this.name = 'position';
  }
}

class PlayerComponent {
  constructor(width, height) {
    this.player = true;

    this.name = 'player';
    this.xPos = mouseX;
    this.yPos = mouseY;
    this.width = width;
    this.height = height;
  }
}

class DespawnSystem {
  despawn(entity) {
    delete entities[entity.id];
    addRaindrop();
  }

  render(entities) {
    for (const entityId in entities) {
      const entity = entities[entityId];
      if (entity.components.position) {
        if (entity.components.position.yPos >= height) {
          this.despawn(entity);
        }
      }
    }
  }
}

class DropSystem {
  fallObject(distance) {
    this.yPos += distance;
  }

  render(entities) {
    const fallDistance = random(5, 35);

    for (const entityId in entities) {
      const entity = entities[entityId];
      if (entity.components.position) {
        // Call fall component using the state as the this
        this.fallObject.bind(entity.components.position)(fallDistance);
      }
    }
  }
}

class CollisionSystem {
  isCollision(rect1, rect2) {
    if (rect1.xPos < rect2.xPos + rect2.width &&
       rect1.xPos + rect1.width > rect2.xPos &&
       rect1.yPos < rect2.yPos + rect2.height &&
       rect1.yPos + rect1.height > rect2.yPos) {
        // collision detected!
        return true;
    }

    return false;
  }

  render(entities) {
    const positionedEntities = [];
    let player;
    for (const entityId in entities) {
      const entity = entities[entityId];
      if (entity.components.player) {
        player = entity;
      } else if (entity.components.position) {
        entity.components.position.collidingWith = [];
        positionedEntities.push(entity);
      }
    }

    if (player) {
      const playerWidth = Math.floor(player.components.player.width / 2);
      const playerHeight = Math.floor(player.components.player.height / 2);

      const playerXPosLeft = player.components.player.xPos - playerWidth;
      const playerXPosRight = player.components.player.xPos + playerWidth;

      const playerYPosUp = player.components.player.yPos - playerHeight;
      const playerYPosDown = player.components.player.yPos + playerHeight;

      positionedEntities.forEach(entity => {
        // Create the space the entity exists in
        const { height, width, xPos, yPos } = entity.components.position;
        const xPosRight = xPos + width;
        const yPosBottom = yPos + height;

        if (this.isCollision(entity.components.position, player.components.player)) {
          entity.components.position.collidingWith.push(player);
        }

      });
    }
  }
}

class BounceSystem {
  render(entities) {
    for (const entityId in entities) {
      const entity = entities[entityId];
      if (entity.components.position && entity.components.position.collidingWith && entity.components.position.collidingWith.length > 0) {
        // If we are colliding with something...
        // Call fall component using the state as the this
        entity.components.position.skew = 6;
      }
    }

  }
}

class PlayerSystem {
  render(entities) {
    for (const entityId in entities) {
      const entity = entities[entityId];
      if (entity.components.player) {
        entity.components.player.xPos = mouseX - Math.floor(entity.components.player.width / 2);
        entity.components.player.yPos = mouseY - Math.floor(entity.components.player.height / 2);
      }
    }

  }
}

class RenderSystem {
  renderObject() {
    fill(this.backgroundColor);
    noStroke()
    push();
    if (this.skew) {
      rotate(PI);
    }
    translate(this.xPos, this.yPos);
    rect(0, 0, this.width, this.height);
    pop();
  }

  render(entities) {
    for (const entityId in entities) {
      const entity = entities[entityId];
      if (entity.components.position) {
        // Call fall component using the state as the this
        this.renderObject.bind(entity.components.position)();
      }
    }
  }
}

const systems = [
  new PlayerSystem(),
  new DropSystem(),
  new DespawnSystem(),
  new CollisionSystem(),
  new BounceSystem(),
  new RenderSystem(),
]

function setup() {
  const canvasHeight = window.innerHeight;
  const canvasWidth = window.innerWidth;

  const body = document.querySelector('body');
  body.style.backgroundColor = BACKGROUND;

  createCanvas(canvasWidth, canvasHeight);

  const rd = new Entity();
  rd.withComponent(new PlayerComponent(200, 200));
  entities[rd.id] = rd;

  createRain();
}

function createRain() {
  for (i = 0; i < RAINDROP_TOTAL; i++) {
    addRaindrop();
  }
}

function draw() {
  background(BACKGROUND);
  push();

  systems.forEach(system => {
    system.render(entities);
  });

  pop();
}
