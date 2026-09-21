# Reference: 120 Camera Movement Codes (Google Flow)

Source: John Savage AI — "120 Camera Movement Codes" (Google Flow video prompts, flow.google.com). Use the `/code` as the camera-direction prompt fragment when generating or editing video content.

## 01 — Dolly moves (move closer/farther through real space)
001 `/dolly in` — Move the camera straight toward the subject at a steady pace, ending in a tighter frame with natural background parallax.
002 `/dolly out` — Move the camera straight away from the subject, widening the view and revealing more of the surrounding location.
003 `/slow push` — Creep forward almost imperceptibly toward the subject throughout the shot, building attention without a sudden change in speed.
004 `/fast push` — Make a quick forward camera move toward the subject, then decelerate smoothly into a close view.
005 `/micro push` — Move forward only a short distance toward a small subject, producing subtle depth without changing the composition dramatically.
006 `/long approach` — Travel forward from a distant wide view to a medium view of the subject, maintaining one clear approach path.
007 `/diagonal push` — Approach the subject diagonally from the front-left, ending at a closer three-quarter view while keeping it framed.
008 `/diagonal retreat` — Retreat diagonally toward the back-right, keeping the subject visible as a new side of the environment opens up.
009 `/ground push` — Glide forward just above the ground toward the subject, keeping nearby floor texture visible as it passes beneath the lens.
010 `/ceiling push` — Move forward near ceiling height while looking slightly down toward the subject, keeping the height constant.
011 `/push through` — Move forward through an open doorway toward the subject beyond it, passing through the opening without crossing solid surfaces.
012 `/retreat reveal` — Begin close to the subject and retreat through an open doorway, ending with the room visible inside the doorway frame.

## 02 — Sideways & parallax (translate instead of turning in place)
013 `/truck left` — Slide the camera straight left at constant height, keeping its viewing direction fixed as nearby and distant layers separate.
014 `/truck right` — Slide the camera straight right at constant height, keeping its viewing direction fixed as the background moves across the frame.
015 `/short slider` — Glide sideways a short distance past the subject, creating a restrained parallax shift for a calm detail shot.
016 `/long slider` — Travel laterally across the full scene at a steady pace, revealing successive foreground and background layers.
017 `/diagonal slide` — Slide sideways and slightly forward toward the subject, maintaining a stable horizon and a gentle change in perspective.
018 `/counter track` — Travel sideways in the opposite direction to the moving subject while smoothly turning to keep it visible.
019 `/foreground pass` — Slide past a nearby foreground object so it briefly crosses the frame, with the main subject remaining farther behind it.
020 `/pillar reveal` — Start with the subject hidden behind a pillar, then slide sideways until the subject is fully revealed beside it.
021 `/window slide` — Travel laterally outside a window, looking through the glass toward the subject and preserving the visible window frame.
022 `/doorway slide` — Move sideways across an open doorway, briefly revealing the subject inside as the doorway passes across the composition.
023 `/parallel wall` — Glide parallel to a textured wall, maintaining a fixed distance so its surface flows steadily past the camera.
024 `/layered slide` — Slide sideways across three clearly separated depth layers, making the near layer pass fastest and the distant layer slowest.

## 03 — Pans & tilts (rotate the view from a fixed position)
025 `/pan left` — Rotate the camera smoothly to the left from a fixed position, scanning across the scene without sideways travel.
026 `/pan right` — Rotate the camera smoothly to the right from a fixed position, scanning across the scene without sideways travel.
027 `/tilt up` — Rotate the camera upward from a fixed position, beginning on a low detail and ending on the upper subject.
028 `/tilt down` — Rotate the camera downward from a fixed position, beginning above the subject and ending on a lower detail.
029 `/whip pan` — Pan rapidly right with a brief sweep of directional blur, then settle on the next subject in the same location.
030 `/whip tilt` — Tilt rapidly upward with a brief sweep of vertical blur, then settle on a higher subject without changing camera position.
031 `/follow pan` — Keep the camera position fixed and pan with a subject crossing the scene, maintaining its position within the frame.
032 `/anticipation pan` — Pan ahead of the moving subject toward its destination, then hold as the subject enters the new composition.
033 `/delayed pan` — Let the subject begin to leave the frame before panning to catch up, ending with it comfortably framed again.
034 `/diagonal pan` — From a fixed position, pan right and tilt up together, moving the view diagonally toward an elevated subject.
035 `/scan return` — Pan slowly across the scene to a chosen detail, pause briefly, then pan back to the original composition.
036 `/pan sweep` — Rotate horizontally through a broad 180-degree view from one fixed position, revealing the space behind the starting view.

## 04 — Rise & descend (change camera height, clear start/finish)
037 `/pedestal up` — Raise the entire camera straight upward while keeping the lens angle unchanged, revealing higher layers of the scene.
038 `/pedestal down` — Lower the entire camera straight downward while keeping the lens angle unchanged, ending at a lower viewpoint.
039 `/crane up` — Lift the camera along a broad upward arc, gradually revealing the full environment around the subject.
040 `/crane down` — Descend along a broad crane arc from an elevated wide view toward a closer view of the subject.
041 `/jib reveal` — Lift the camera in a short controlled arc above a foreground obstruction, revealing the subject behind it.
042 `/rise tilt` — Raise the camera while tilting downward to keep the subject centered as the viewpoint becomes more elevated.
043 `/descend tilt` — Lower the camera while tilting upward to keep the subject framed as the viewpoint moves closer to ground level.
044 `/roof reveal` — Rise vertically from below a roofline until the distant landscape becomes visible above the roof.
045 `/table rise` — Begin below table height and raise the camera until the object on the tabletop comes fully into view.
046 `/floor drop` — Lower the camera from waist height to just above the floor, ending on the subject's feet or a ground-level object.
047 `/stair ascent` — Travel upward along a staircase behind the subject, keeping a smooth forward-and-upward path at a steady distance.
048 `/stair descent` — Travel downward along a staircase behind the subject, keeping the steps visible and the descent controlled.

## 05 — Orbits & arcs (travel around the subject, subject as anchor)
049 `/arc left` — Move through a short curved path toward the subject's left side, turning the lens to keep the subject centered.
050 `/arc right` — Move through a short curved path toward the subject's right side, turning the lens to keep the subject centered.
051 `/quarter orbit` — Travel a 90-degree arc from a front view to a side view of the subject, keeping distance and height constant.
052 `/half orbit` — Travel a 180-degree arc from the front to the back of the subject, keeping a smooth pace and stable distance.
053 `/orbit360` — Complete one full 360-degree circle around the subject, returning to the starting viewpoint at the end of the shot.
054 `/tight orbit` — Circle close to the subject in a short controlled arc, emphasizing nearby detail and strong background parallax.
055 `/wide orbit` — Circle the subject from farther away, keeping its surrounding landscape prominent in the composition.
056 `/low orbit` — Orbit the subject near ground level while looking slightly upward, maintaining consistent height and distance.
057 `/high orbit` — Orbit from above eye level while looking down toward the subject, maintaining a steady elevated viewpoint.
058 `/spiral rise` — Circle around the subject while steadily gaining height, ending above the initial orbit plane.
059 `/spiral descend` — Circle around the subject while steadily losing height, ending near eye level without crossing into the subject.
060 `/orbit tighten` — Follow a curved inward spiral around the subject, gradually reducing distance while keeping camera height constant.

## 06 — Follow & tracking (travel with a moving subject)
061 `/rear follow` — Follow directly behind the moving subject at its speed, holding a steady distance and a clear view of the path ahead.
062 `/front follow` — Travel backward ahead of the moving subject, facing it and matching its speed so its size stays consistent.
063 `/side follow` — Travel beside the subject in profile, matching its speed and holding a constant lateral distance.
064 `/shoulder follow` — Follow just behind one shoulder, keeping that shoulder near the foreground and the destination visible beyond it.
065 `/three-quarter follow` — Track from ahead and to one side of the moving subject, preserving a clear three-quarter view of its face or front.
066 `/low follow` — Follow the moving subject near ankle height, emphasizing footfalls or wheels while matching its forward speed.
067 `/high follow` — Follow from an elevated rear viewpoint, showing both the moving subject and the route it is taking.
068 `/overtake` — Begin behind the moving subject, travel faster to pass beside it, then turn back slightly as the camera moves ahead.
069 `/fall behind` — Begin alongside the moving subject, then gradually slow the camera so the subject moves farther ahead into the scene.
070 `/catch up` — Begin well behind the moving subject, increase camera speed to close the gap, then settle into a steady follow distance.
071 `/curve follow` — Follow the subject around a visible bend, turning and translating smoothly to preserve its position within the frame.
072 `/handoff track` — Track the first subject until it passes a second subject, then continue traveling with the second in one continuous shot.

## 07 — Aerial moves (clear flight paths, readable sense of scale)
073 `/drone fly` — Fly smoothly forward and upward away from the starting subject, revealing the surrounding landscape as the subject becomes smaller.
074 `/drone approach` — Fly forward from a distant aerial view toward the subject, gradually descending to a closer elevated composition.
075 `/drone pullback` — Fly backward away from the subject at a constant altitude, revealing a wider landscape while keeping it centered.
076 `/drone ascend` — Rise vertically above the starting position, keeping the ground subject framed as the surrounding area expands.
077 `/drone descend` — Descend vertically from a high aerial view toward the ground subject, finishing at a comfortable elevated distance.
078 `/drone orbit` — Fly a broad level circle around a building or landscape feature, keeping it centered throughout the flight.
079 `/drone flyover` — Fly directly over the subject and continue beyond it, tilting down as it passes beneath the camera.
080 `/drone flyby` — Fly past one side of the subject at a constant altitude, allowing it to cross the frame with clear background parallax.
081 `/topdown travel` — Fly forward with the camera looking straight down, making the terrain scroll smoothly beneath the frame.
082 `/coastline follow` — Fly along the curve of a coastline at steady altitude, keeping land on one side of the frame and water on the other.
083 `/ridge reveal` — Fly upward and forward over a ridge, revealing the valley beyond only as the camera clears the ridge line.
084 `/aerial retreat` — Fly backward and upward together while tilting down toward the subject, ending in a broad overhead establishing view.

## 08 — FPV & immersive flight (faster routes, simple paths)
085 `/fpv chase` — Fly low behind a moving subject with responsive turns, preserving enough distance to keep its full motion readable.
086 `/fpv dive` — Dive steeply down beside a tall structure, then pull smoothly into level forward flight above the ground.
087 `/fpv climb` — Fly forward into a steep upward climb beside a tall structure, finishing above its highest point.
088 `/fpv bank` — Fly forward through a broad banked turn, rolling gently into the turn and leveling the horizon at the end.
089 `/fpv slalom` — Fly through a sequence of widely spaced obstacles using alternating left and right turns without touching them.
090 `/gap flythrough` — Fly straight through a clearly open gap, keeping the opening centered until the camera has passed through it.
091 `/tunnel flight` — Fly forward through an open tunnel along its centerline, preserving the walls and the bright exit ahead.
092 `/window flythrough` — Fly through an already open window into the room beyond, keeping the frame intact and avoiding the window edges.
093 `/doorway flight` — Fly through two aligned open doorways in one smooth forward path, revealing the connected rooms.
094 `/ground skim` — Fly just above the ground at speed, following the terrain while maintaining a safe, consistent clearance.
095 `/canopy flight` — Fly forward beneath a tree canopy along a clear open path, letting branches pass above and beside the camera.
096 `/fpv corkscrew` — Fly forward while completing one controlled 360-degree camera roll, then finish with a level horizon.

## 09 — Handheld & mounted (specific physical character)
097 `/handheld drift` — Add gentle irregular handheld drift while keeping the subject comfortably framed, as if an operator were standing still.
098 `/handheld walk` — Walk toward the subject with restrained vertical footstep motion and natural operator corrections.
099 `/handheld run` — Run behind the subject with stronger footstep bounce and brief framing corrections while keeping the action readable.
100 `/shoulder sway` — Observe the subject from a shoulder-mounted camera with slow weight shifts and subtle breathing motion.
101 `/gimbal glide` — Travel smoothly through the space at walking speed, keeping the horizon level and suppressing footstep bounce.
102 `/gimbal corner` — Glide around a visible corner, rotating smoothly as the next section of the location is revealed.
103 `/bodycam walk` — Move forward with a chest-mounted viewpoint, allowing rhythmic body sway as the wearer walks through the scene.
104 `/helmet turn` — Use a head-mounted viewpoint that turns toward a nearby subject, pauses, and then turns back toward the travel direction.
105 `/vehicle forward` — Move with a forward-facing camera attached to a traveling vehicle, with road features approaching and passing naturally.
106 `/window ride` — Use a side-facing camera on a moving vehicle, letting nearby scenery pass quickly and distant scenery pass more slowly.
107 `/wheel track` — Travel with a low camera mounted near a turning vehicle wheel, keeping the wheel anchored as the road passes beneath it.
108 `/snorricam walk` — Keep the camera fixed relative to a walking person's torso, holding the face centered while the background sways behind them.

## 10 — Compound moves (combine two deliberate motions in one continuous shot)
109 `/dolly zoom` — Dolly backward while zooming in to keep the subject the same size, making the background appear to compress behind it.
110 `/reverse vertigo` — Dolly forward while zooming out to keep the subject the same size, making the background appear to stretch away.
111 `/push orbit` — Push straight toward the subject, then transition smoothly into a short orbit at the new closer distance.
112 `/orbit pullback` — Begin with a short orbit around the subject, then peel away into a straight backward move that reveals the wider scene.
113 `/rise pullback` — Rise and travel backward together, increasing both camera height and distance while keeping the subject visible below.
114 `/descend push` — Descend and move forward together, beginning high and wide and ending closer to the subject at eye level.
115 `/track reveal` — Track beside a moving subject, then continue sideways after it stops to reveal something previously hidden behind it.
116 `/pan push` — Pan toward a subject from a fixed position, then begin a straight forward dolly once the subject is centered.
117 `/tilt retreat` — Tilt down from the upper subject to a lower detail, then retreat to reveal the full subject and its surroundings.
118 `/slide arc` — Begin with a straight lateral slide, then curve toward the subject into a short arc without stopping.
119 `/orbit reverse` — Orbit slowly in one direction, ease to a stop, then reverse the same camera path back toward the starting angle.
120 `/loop path` — Follow a smooth closed camera path and return to the original position, angle and speed for a repeatable visual loop.
