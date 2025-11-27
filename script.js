let body1;
let body2

let floor;

let headIndexStart = 0
let torsoIndexStart = headIndexStart + 16 * 5
let upperArmIndexStart = torsoIndexStart + 14 * 2 + 5
let lowerArmIndexStart = upperArmIndexStart + 12
let handIndexStart = lowerArmIndexStart + 12
let upperLegIndexStart = handIndexStart + 6 * 2 + 20 + 13
let lowerLegIndexStart = upperLegIndexStart + 6
let footIndexStart = lowerLegIndexStart + 6
let endIndex = footIndexStart + 16 * 2 - 2 // This index doesn't exist

function preload() {

}

async function getRandomBodyImage(tone, part) {
    if (part === "head") {
        return await _getRandomBodyImage(tone, headIndexStart, 9)
    }
    if (part === "torso") {
        return await _getRandomBodyImage("PaleDead", torsoIndexStart, upperArmIndexStart - 1)
    }
    if (part === "arm.upper") {
        return await _getRandomBodyImage("PaleDead", upperArmIndexStart, lowerArmIndexStart - 1)
    }
    if (part === "arm.lower") {
        return await _getRandomBodyImage("PaleDead", lowerArmIndexStart, handIndexStart - 1)
    }
    if (part === "arm.hand") {
        return await _getRandomBodyImage(tone, handIndexStart, handIndexStart + 6)
    }
    if (part === "leg.upper") {
        return await _getRandomBodyImage("PaleDead", upperLegIndexStart, lowerLegIndexStart - 1)
    }
    if (part === "leg.lower") {
        return await _getRandomBodyImage("PaleDead", lowerLegIndexStart, footIndexStart - 1)
    }
    if (part === "leg.foot") {
        return await _getRandomBodyImage(tone, footIndexStart, endIndex - 1)
    }
}

async function _getRandomBodyImage(tone, indexStart, indexEnd) {
    return await loadImage(`assets/human/${tone}/${randomInt(indexStart, indexEnd - 1)}.png`)
}

async function setup() {
    const close = 1
    new Canvas(1280 / close, 720 / close)
    canvas.style.imageSmoothingEnabled = false
    canvas.style.imageRendering = "pixelated"
    displayMode(MAXED)
    angleMode(DEGREES)
    noSmooth()

    world.gravity.y = 10;

    body1 = await createBody(true)
    body2 = await createBody(false)

    floor = new Sprite()
    floor.x = canvas.w / 2
    floor.y = 600
    floor.width = 1000
    floor.height = 10
    floor.physicsType = STA
    floor.fill = "rgba(143, 10, 10, 1)"
    floor.stroke = "rgba(0, 0, 0, 0)"
}

function update() {
    background("rgba(44, 44, 44, 1)")
    body1.group.overlaps(body1.group)
    body1.group.collide(floor)

    body2.group.overlaps(body2.group)
    body1.group.collide(floor)

    if (kb.pressing("space")) {
        body1.group.debug = true
        body2.group.debug = true
    } else {
        body1.group.debug = false
        body2.group.debug = false
    }

    if (kb.pressing("e")) {
    } else {
    }

    if (mouse.pressing()) {
        const off = body1.leg1.lower
        // console.log(mouse.x - off.x, mouse.y - off.y)
    }

    for (const part of body1.group) {
        if (part.mouse.dragging()) {
            part.moveTowards(
                mouse.x + part.mouse.x,
                mouse.y + part.mouse.y,
                2
            );
        }
    }

    for (const part of body2.group) {
        if (part.mouse.dragging()) {
            part.moveTowards(
                mouse.x + part.mouse.x,
                mouse.y + part.mouse.y,
                2
            );
        }
    }
}

function randomInt(from, to) {
    return Math.floor(random(from, to))
}

async function createBody(isOne) { // Is left
    isOne = isOne ? 1 : -1
    const tone = (Math.random() > 0.5 ? "CoolTone" : "WarmTone") + randomInt(1, 6)

    const shirtColor = color(randomInt(75, 125), randomInt(75, 125), randomInt(75, 125))
    const pantsColor = color(randomInt(25, 75), randomInt(25, 75), randomInt(25, 75))

    const body = {
        head: null,
        torso: null,
        arm1: {
            upper: null,
            lower: null,
            hand: null
        },
        arm2: {
            upper: null,
            lower: null,
            hand: null
        },
        leg1: {
            upper: null,
            lower: null,
            foot: null
        },
        leg2: {
            upper: null,
            lower: null,
            foot: null
        },
        joints: {
            headTorso: null,
            arm1: {
                upperTorso: null,
                lowerUpper: null,
                handLower: null
            },
            arm2: {
                upperTorso: null,
                lowerUpper: null,
                handLower: null
            },
            leg1: {
                upperTorso: null,
                lowerUpper: null,
                footLower: null
            },
            leg2: {
                upperTorso: null,
                lowerUpper: null,
                footLower: null
            },
        },
        group: null,
        images: {
            head: await getRandomBodyImage(tone, "head"),
            torso: await getRandomBodyImage(tone, "torso"),
            arm: {
                upper: await getRandomBodyImage(tone, "arm.upper"),
                lower: await getRandomBodyImage(tone, "arm.lower"),
                hand: await getRandomBodyImage(tone, "arm.hand")
            },
            leg: {
                upper: await getRandomBodyImage(tone, "leg.upper"),
                lower: await getRandomBodyImage(tone, "leg.lower"),
                foot: await getRandomBodyImage(tone, "leg.foot")
            }
        }
    }

    body.group = new Group();

    body.torso = new Sprite(body.group)
    body.torso.x = canvas.w / 2 - 100 * isOne
    body.torso.y = canvas.h / 2 - 30
    body.torso.width = 4
    body.torso.height = 10
    body.torso.image = body.images.torso
    body.torso.layer = 1

    body.head = new Sprite(body.group)
    body.head.x = body.torso.x - 2 * isOne
    body.head.y = body.torso.y - 47
    body.head.diameter = 5
    body.head.image = body.images.head
    body.head.layer = 2
    body.head.vel.x = 2 * isOne

    // Arms
    for (let i = 0; i < 2; i++) {
        const part = "arm" + (i + 1)
        const obj = body[part]
        obj.upper = new Sprite(body.group)
        obj.upper.x = body.torso.x - 3 * isOne
        obj.upper.y = body.torso.y - 9
        obj.upper.width = 2
        obj.upper.height = 6
        obj.upper.image = body.images.arm.upper
        obj.upper.layer = 3 - 3 * i

        obj.lower = new Sprite(body.group)
        obj.lower.x = obj.upper.x
        obj.lower.y = obj.upper.y + 30
        obj.lower.width = 2
        obj.lower.height = 6
        obj.lower.image = body.images.arm.lower
        obj.lower.layer = 2 - 3 * i

        obj.hand = new Sprite(body.group)
        obj.hand.x = obj.lower.x + 2 * isOne
        obj.hand.y = obj.lower.y + 23
        obj.hand.width = 2
        obj.hand.height = 3
        obj.hand.image = body.images.arm.hand
        obj.hand.rotation = 90
        obj.hand.layer = 2 - 3 * i
    }

    // Legs
    for (let i = 0; i < 2; i++) {
        const part = "leg" + (i + 1)
        const obj = body[part]
        obj.upper = new Sprite(body.group)
        obj.upper.x = body.torso.x - 0.81 * isOne
        obj.upper.y = body.torso.y + 36.60
        obj.upper.width = 3
        obj.upper.height = 8
        obj.upper.image = body.images.leg.upper
        obj.upper.layer = 1 - 3 * i

        obj.lower = new Sprite(body.group)
        obj.lower.x = obj.upper.x
        obj.lower.y = obj.upper.y + 40
        obj.lower.width = 3
        obj.lower.height = 8
        obj.lower.image = body.images.leg.lower
        obj.lower.layer = 0 - 3 * i

        obj.foot = new Sprite(body.group)
        obj.foot.x = obj.lower.x + 5.96 * isOne
        obj.foot.y = obj.lower.y + 31.5
        obj.foot.width = 5
        obj.foot.height = 1
        obj.foot.addCollider(-1, -1, 2, 2)
        obj.foot.image = body.images.leg.foot
        obj.foot.image.offset.y = -1
        obj.foot.layer = 0 - 3 * i
    }


    for (const part of body.group) {
        part.scale = 5
        part.scale.x *= isOne
        part.physicsType = DYN
        part.resetMass()
    }



    // Joints

    body.joints.headTorso = createBodyHinge(
        isOne, body.head, body.torso,
        150 / 2, -150 / 2,
        { x: -5.18, y: -13.05 },
        { x: -4.31, y: -33 }
    )

    // Arms
    for (let i = 0; i < 2; i++) {
        const part = "arm" + (i + 1)
        const obj = body.joints[part]
        obj.upperTorso = createBodyHinge(
            isOne, body[part].upper, body.torso,
            Infinity, -Infinity,
            { x: -0.27, y: -11.08 },
            { x: -3.47, y: -20.47 }
        )

        obj.lowerUpper = createBodyHinge(
            isOne, body[part].lower, body[part].upper,
            150, 0,
            { x: 0, y: -body[part].lower.height / 2 },
            { x: 0, y: body[part].upper.height / 2 }
        )

        obj.footLower = createBodyHinge(
            isOne, body[part].hand, body[part].lower,
            30, -50,
            { x: -0.99, y: -7.94 },
            { x: 0.79, y: 17.26 }
        )
    }

    // Legs
    for (let i = 0; i < 2; i++) {
        const part = "leg" + (i + 1)
        const obj = body.joints[part]
        obj.upperTorso = createBodyHinge(
            isOne, body[part].upper, body.torso,
            100, -30,
            { x: 0.15, y: -13.35 },
            { x: -1.55, y: 22.36 }
        )

        obj.lowerUpper = createBodyHinge(
            isOne, body[part].upper, body[part].lower,
            150, 0,
            { x: 0, y: 20.8 },
            { x: 0, y: -20.2 }
        )

        obj.footLower = createBodyHinge(
            isOne, body[part].foot, body[part].lower,
            30, -50,
            { x: -5.59, y: -11.35 },
            { x: 0.81, y: 20.15 }
        )
    }

    applyTintToSprite(body.torso, shirtColor)
    applyTintToSprite(body.arm1.upper, shirtColor)
    applyTintToSprite(body.arm1.lower, shirtColor)
    applyTintToSprite(body.arm2.upper, shirtColor)
    applyTintToSprite(body.arm2.lower, shirtColor)
    applyTintToSprite(body.leg1.upper, pantsColor)
    applyTintToSprite(body.leg1.lower, pantsColor)
    applyTintToSprite(body.leg2.upper, pantsColor)
    applyTintToSprite(body.leg2.lower, pantsColor)

    return body
}

function createBodyHinge(isOne, part1, part2, upperLimit, lowerLimit, offsetA, offsetB) {
    if (isOne === 1) {
        const hinge = new HingeJoint(part1, part2)
        hinge.upperLimit = upperLimit
        hinge.lowerLimit = lowerLimit
        hinge.offsetA.x = offsetA.x
        hinge.offsetA.y = offsetA.y
        hinge.offsetB.x = offsetB.x
        hinge.offsetB.y = offsetB.y
    } else {
        const hinge = new HingeJoint(part2, part1)
        hinge.upperLimit = upperLimit
        hinge.lowerLimit = lowerLimit
        hinge.offsetB.x = -offsetA.x
        hinge.offsetB.y = offsetA.y
        hinge.offsetA.x = -offsetB.x
        hinge.offsetA.y = offsetB.y
    }
}

function applyTintToSprite(sprite, color) {
    const draw = sprite._draw
    sprite.draw = function () {
        push()
        tint(color)
        draw()
        pop()
    }
    return sprite
}