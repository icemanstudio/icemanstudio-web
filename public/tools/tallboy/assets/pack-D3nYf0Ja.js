import{a as e,r as t,s as n}from"./camera-DP3TmLa5.js";import{l as r,o as i,u as a}from"./browser-BlPaUuTQ.js";import{t as o}from"./tallboy-BhCJt3su.js";import{i as s,n as c,t as l}from"./png-RRx7xQNx.js";import{n as u,r as d}from"./raster-Dh25OAgv.js";import{a as f,n as p,o as m,r as h}from"./maps-ogfqeHV_.js";import{at as g,et as _,it as v,nt as y,rt as b,tt as x}from"./index-47ni6VQk.js";function S(e){let t=[1/0,1/0,1/0,-1/0,-1/0,-1/0];for(let n=0;n<e.length;n+=3)for(let r=0;r<3;r++){let i=e[n+r];i<t[r]&&(t[r]=i),i>t[r+3]&&(t[r+3]=i)}return t}function C(r,i,a){let o=i.supersample??1,s=i.canvas.w,c=i.canvas.h,l=i.margin??4,u=S(r.pos),d=i.camera??n(`iso21`),f=d.yaw??-45;return i.angles.map(n=>{let r={...d,target:[...d.target]};r.yaw=f+n;let i,p=1;r.proj===`persp`?(i=t(e(r,u,s*o,c*o,l*o),s*o,c*o),p=o):i=t(e(r,u,s,c,l),s,c);let m=a.rect.x,h=a.rect.y;return{yaw:n,cam:i,k:p,project(e,t,n){let r=i.project(e,t,n);return[r[0]/p-m,r[1]/p-h]}}})}function w(e,t){let n=S(e.pos),r=(n[0]+n[3])*.5,i=(n[1]+n[4])*.5;return t.map(e=>{let t=e.project(r,i,0);return[Math.floor(t[0]+.5),Math.floor(t[1]+.5)]})}function T(e,t){let n=new Uint8Array(12+t.length),r=new DataView(n.buffer);r.setUint32(0,t.length);for(let t=0;t<4;t++)n[4+t]=e.charCodeAt(t);return n.set(t,8),r.setUint32(8+t.length,c(n,4,8+t.length)),n}function E(e,t,n,r){if(t<1||n<1||e.length!==t*n)throw Error(`Bad mask size`);let i=Math.ceil(t/8),o=new Uint8Array((i+1)*n);for(let r=0;r<n;r++){let n=r*(i+1)+1;for(let i=0;i<t;i++)e[r*t+i]&&(o[n+(i>>3)]|=128>>(i&7))}let s=new Uint8Array(13),c=new DataView(s.buffer);c.setUint32(0,t),c.setUint32(4,n),s[8]=1,s[9]=0;let u=[l,T(`IHDR`,s)];for(let[e,t]of Object.entries(r??{})){let n=e.replace(/[^\x20-\x7e]/g,``).slice(0,79);if(!n||!t)continue;let r=new Uint8Array(n.length+1+t.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);for(let e=0;e<t.length;e++){let i=t.charCodeAt(e);r[n.length+1+e]=i<256?i:63}u.push(T(`tEXt`,r))}u.push(T(`IDAT`,a(o,{level:9})),T(`IEND`,new Uint8Array));let d=0;for(let e of u)d+=e.length;let f=new Uint8Array(d),p=0;for(let e of u)f.set(e,p),p+=e.length;return f}var D=new Map([[`export-templates/README.md`,'# Tallboy engine pack (format 1)\n\nThis zip holds a building baked by Tallboy, ready for a 2D y-sorted game:\n\n- `building.json`: footprint, anchor, y-sort line, collision box, doors, and (Full) windows\n  with night light, per-floor masks and ground regions. `"format": 1` never changes meaning;\n  a future incompatible layout gets a new number.\n- `sprites/<name>_<pass>_a<yaw>.png`: one PNG per baked pass and angle, all the same size.\n- `masks/<name>_occlusion_a<yaw>.png`: 1-bit mask, same size as the sprite. White = the\n  pixels to fade while the player is behind the building.\n- `masks/<name>_floor<N>_a<yaw>.png` (Full): the occlusion mask split per floor, bottom first,\n  to fade only the floors above the player or cut a building open floor by floor.\n- `export-templates/`: the importers below.\n\n## Coordinates\n\n- Sprite pixels: origin at the top-left corner of the sprite, x right, y down, a pixel\'s centre\n  at +0.5. `angles[i].pivot` is the ground anchor (the base centre of the building).\n- World: texels, z up, 16 texels = 1 metre (the scale of Tallboy\'s GLB export).\n- Rings: outer rings counter-clockwise, holes (courtyards) clockwise, in world space (Y up).\n  Their pixel copies in `angles[i]` keep the vertex order (the screen flips Y).\n\n## Y-sort\n\n`angles[i].ysort` has two points `a` and `b` (the leftmost and rightmost footprint corners on\nscreen) and `y`, their middle. A character is in front of the building when its feet are below\nthe line a-b at its x; with a single sort point per node (Godot, Unity pivot sorting) use the\npivot, or `ysort.y` for a slightly earlier switch.\n\n## Godot 4\n\n1. Copy the unzipped pack into the project, for example `res://tallboy/shop/`, and\n   `export-templates/godot/*.gd` next to it (or anywhere, keeping both files together).\n2. Open `import_tallboy.gd`, set `PACK_DIR`, and run it (File > Run). It saves one\n   `building_a<yaw>.tscn` per angle.\n3. Instance the scene under a node with `y_sort_enabled = true`. Add your player to the group\n   `player`: the occluder fades the building while the player is behind it.\n\nAt runtime, `preload("import_tallboy.gd").build(dir, angle)` returns the same node.\n\n## Unity\n\n1. Unzip the pack under `Assets/`.\n2. Copy `export-templates/unity/TallboyBuilding.cs` under `Assets/` and\n   `export-templates/unity/Editor/TallboyImporter.cs` under `Assets/Editor/`.\n3. Tools > Tallboy > Import engine pack..., pick `building.json`.\n4. Set Project Settings > Graphics > Transparency Sort Mode = Custom Axis (0, 1, 0), and drag\n   your player into `TallboyBuilding.player`.\n\n## Credits\n\nIf the building came from OpenStreetMap data, `building.json` carries `credits` and every PNG\na `Copyright` text chunk. The ODbL asks you to show that attribution in your game\'s credits.\n'],[`export-templates/godot/import_tallboy.gd`,`@tool
extends EditorScript
## Tallboy engine pack importer for Godot 4 (format 1). Keep tallboy_occluder.gd next to it.
##
## Editor use: copy the unzipped pack into your project (for example res://tallboy/shop/),
## set PACK_DIR below, open this script in the Script editor and run File > Run (Ctrl+Shift+X).
## It saves <PACK_DIR>/building_a<angle>.tscn for every baked angle.
##
## Runtime use: preload("res://.../import_tallboy.gd").build(pack_dir, angle_index) returns
## the same Node2D without saving anything.
##
## The scene: a Node2D whose origin is the building's ground anchor (the "pivot"), so put it
## under a parent with y_sort_enabled = true and it sorts with the player by that point.
## Children: Shadow / Color / Night / Outline sprites, a StaticBody2D with the footprint
## polygon, an occluder (tallboy_occluder.gd) that fades the building where the occlusion
## mask is white while a body of the "player" group stands behind it, and Marker2D nodes for
## doors and windows (metadata: dir, lit, facing).

const PACK_DIR := "res://tallboy/building"
const Occluder := preload("tallboy_occluder.gd")


func _run() -> void:
	var data := read_json(PACK_DIR)
	if data.is_empty():
		push_error("Tallboy: no building.json in " + PACK_DIR)
		return
	for a in data["angles"]:
		var root := build(PACK_DIR, int(a["index"]))
		var packed := PackedScene.new()
		_own(root, root)
		packed.pack(root)
		var tag := "a%03d" % int(round(float(a["yaw"])))
		var path := PACK_DIR.path_join("building_%s.tscn" % tag)
		ResourceSaver.save(packed, path)
		root.free()
		print("Tallboy: saved ", path)


static func read_json(dir: String) -> Dictionary:
	var path := dir.path_join("building.json")
	if not FileAccess.file_exists(path):
		return {}
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(path))
	if typeof(parsed) != TYPE_DICTIONARY or int(parsed.get("format", 0)) != 1:
		push_error("Tallboy: unsupported building.json (format 1 expected)")
		return {}
	return parsed


static func texture(dir: String, rel: String) -> Texture2D:
	var path := dir.path_join(rel)
	if ResourceLoader.exists(path):
		return load(path)
	var img := Image.load_from_file(path)
	return ImageTexture.create_from_image(img) if img else null


static func pts(ring: Array, pivot: Vector2) -> PackedVector2Array:
	var out := PackedVector2Array()
	for p in ring:
		out.append(Vector2(float(p[0]), float(p[1])) - pivot)
	return out


static func area(poly: PackedVector2Array) -> float:
	var s := 0.0
	for i in poly.size():
		var p := poly[i]
		var q := poly[(i + 1) % poly.size()]
		s += p.x * q.y - q.x * p.y
	return s * 0.5


static func build(dir: String, angle_index: int = 0) -> Node2D:
	var data := read_json(dir)
	if data.is_empty():
		return null
	var a: Dictionary = data["angles"][angle_index]
	var pivot := Vector2(float(a["pivot"][0]), float(a["pivot"][1]))
	var root := Node2D.new()
	root.name = str(data["name"])
	root.set_meta("tallboy", {"format": 1, "yaw": a["yaw"], "credits": data.get("credits", [])})

	var order := ["Shadow", "Color", "Night", "Outline", "Cutaway"]
	for pass_name in order:
		if not a["sprites"].has(pass_name):
			continue
		var s := Sprite2D.new()
		s.name = pass_name
		s.texture = texture(dir, a["sprites"][pass_name])
		s.centered = false
		s.offset = -pivot
		s.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		s.visible = pass_name != "Night" and pass_name != "Cutaway"
		if pass_name == "Shadow":
			s.z_index = -1
		root.add_child(s)

	var body := StaticBody2D.new()
	body.name = "Collision"
	root.add_child(body)
	# outer rings first, largest first: rings winding like the first one are outer, the
	# others are holes (courtyards the player cannot reach anyway)
	var outer_sign := 0.0
	for ring in a["footprint"]:
		var poly := pts(ring, pivot)
		if poly.size() < 3:
			continue
		var sgn := signf(area(poly))
		if outer_sign == 0.0:
			outer_sign = sgn
		if sgn != outer_sign:
			continue
		var cp := CollisionPolygon2D.new()
		cp.polygon = poly
		body.add_child(cp)

	var occ := Node2D.new()
	occ.name = "Occluder"
	occ.set_script(Occluder)
	occ.set("mask", texture(dir, a["occlusion"]))
	occ.set("pivot", pivot)
	occ.set("ysort_a", Vector2(float(a["ysort"]["a"][0]), float(a["ysort"]["a"][1])) - pivot)
	occ.set("ysort_b", Vector2(float(a["ysort"]["b"][0]), float(a["ysort"]["b"][1])) - pivot)
	root.add_child(occ)

	var doors: Array = data.get("doors", [])
	for i in a["doors"].size():
		var d: Dictionary = a["doors"][i]
		var m := Marker2D.new()
		m.name = "Door%d" % i
		m.position = Vector2(float(d["x"]), float(d["y"])) - pivot
		m.set_meta("dir", Vector2(float(d["dir"][0]), float(d["dir"][1])))
		m.set_meta("facing", d["facing"])
		if i < doors.size():
			m.set_meta("part", doors[i]["part"])
		root.add_child(m)

	if a.has("lights"):
		for i in a["lights"].size():
			var l: Dictionary = a["lights"][i]
			var m := Marker2D.new()
			m.name = "Window%d" % i
			m.position = Vector2(float(l["x"]), float(l["y"])) - pivot
			m.set_meta("lit", l["lit"])
			m.set_meta("facing", l["facing"])
			root.add_child(m)
	return root


static func _own(node: Node, owner: Node) -> void:
	for c in node.get_children():
		c.owner = owner
		_own(c, owner)
`],[`export-templates/godot/tallboy_occluder.gd`,`extends Node2D
## Fades a Tallboy building where its occlusion mask is white while a body of the
## \`player_group\` stands behind it (feet above the y-sort line, inside the masked area).
## Created by import_tallboy.gd; the sibling sprites get a small shader that reads the mask.

@export var mask: Texture2D
@export var pivot := Vector2.ZERO
@export var ysort_a := Vector2.ZERO
@export var ysort_b := Vector2.ZERO
@export var player_group := "player"
@export_range(0.0, 1.0) var faded_alpha := 0.35
@export var fade_speed := 8.0
## Pixels around the feet that also count (the player's body is above its feet).
@export var body_height := 24

const SHADER := """
shader_type canvas_item;
uniform sampler2D occlusion : filter_nearest;
uniform float fade = 1.0;
void fragment() {
	vec4 c = texture(TEXTURE, UV);
	float m = texture(occlusion, UV).r;
	COLOR = vec4(c.rgb, c.a * mix(1.0, fade, step(0.5, m)));
}
"""

var _image: Image
var _fade := 1.0
var _materials: Array[ShaderMaterial] = []


func _ready() -> void:
	if mask:
		_image = mask.get_image()
	var sh := Shader.new()
	sh.code = SHADER
	for c in get_parent().get_children():
		if c is Sprite2D and c.name != "Shadow":
			var mat := ShaderMaterial.new()
			mat.shader = sh
			mat.set_shader_parameter("occlusion", mask)
			c.material = mat
			_materials.append(mat)


func _line_y(x: float) -> float:
	var dx := ysort_b.x - ysort_a.x
	if absf(dx) < 0.001:
		return minf(ysort_a.y, ysort_b.y)
	var t := clampf((x - ysort_a.x) / dx, 0.0, 1.0)
	return lerpf(ysort_a.y, ysort_b.y, t)


func _masked(p: Vector2) -> bool:
	if _image == null:
		return false
	var px := p + pivot
	for dy in range(0, body_height, 4):
		var x := int(px.x)
		var y := int(px.y) - dy
		if x >= 0 and y >= 0 and x < _image.get_width() and y < _image.get_height():
			if _image.get_pixel(x, y).r > 0.5:
				return true
	return false


func _process(delta: float) -> void:
	var behind := false
	for body in get_tree().get_nodes_in_group(player_group):
		if body is Node2D:
			var p: Vector2 = get_parent().to_local(body.global_position)
			if p.y < _line_y(p.x) and _masked(p):
				behind = true
				break
	var target := faded_alpha if behind else 1.0
	_fade = move_toward(_fade, target, fade_speed * delta)
	for m in _materials:
		m.set_shader_parameter("fade", _fade)
`],[`export-templates/unity/TallboyBuilding.cs`,`// Tallboy engine pack (format 1): runtime component for Unity. Keeps the data the importer
// read from building.json and fades the building while the player stands behind it.
// Put this file anywhere under Assets/ (not in an Editor folder).
// Sorting: set Project Settings > Graphics > Transparency Sort Mode = Custom Axis (0, 1, 0);
// the importer sets the sprite's pivot to the ground anchor and Sprite Sort Point = Pivot.

using System.Collections.Generic;
using UnityEngine;

public class TallboyBuilding : MonoBehaviour
{
    [Tooltip("Occlusion mask of this angle (Read/Write enabled): white = fades.")]
    public Texture2D occlusion;
    [Tooltip("Sprite pixels per Unity unit, as imported.")]
    public float pixelsPerUnit = 16f;
    [Tooltip("Pivot in sprite pixels (top-left origin, y down).")]
    public Vector2 pivot;
    [Tooltip("Y-sort line ends in sprite pixels (top-left origin, y down).")]
    public Vector2 ysortA, ysortB;
    public Transform player;
    [Range(0f, 1f)] public float fadedAlpha = 0.35f;
    public float fadeSpeed = 8f;
    public List<Vector2> doors = new List<Vector2>();
    public List<Vector2> litWindows = new List<Vector2>();

    SpriteRenderer[] renderers;
    float alpha = 1f;

    void Awake()
    {
        renderers = GetComponentsInChildren<SpriteRenderer>();
    }

    /// World position -> sprite pixel (top-left origin, y down).
    public Vector2 ToPixel(Vector3 world)
    {
        Vector3 local = transform.InverseTransformPoint(world);
        return new Vector2(pivot.x + local.x * pixelsPerUnit, pivot.y - local.y * pixelsPerUnit);
    }

    float LineY(float x)
    {
        float dx = ysortB.x - ysortA.x;
        if (Mathf.Abs(dx) < 0.001f) return Mathf.Min(ysortA.y, ysortB.y);
        float t = Mathf.Clamp01((x - ysortA.x) / dx);
        return Mathf.Lerp(ysortA.y, ysortB.y, t);
    }

    bool Masked(Vector2 p)
    {
        if (occlusion == null || !occlusion.isReadable) return false;
        for (int dy = 0; dy < 24; dy += 4)
        {
            int x = Mathf.FloorToInt(p.x);
            int y = Mathf.FloorToInt(p.y) - dy;
            if (x < 0 || y < 0 || x >= occlusion.width || y >= occlusion.height) continue;
            // Unity textures have their origin at the bottom-left
            if (occlusion.GetPixel(x, occlusion.height - 1 - y).r > 0.5f) return true;
        }
        return false;
    }

    void Update()
    {
        bool behind = false;
        if (player != null)
        {
            Vector2 p = ToPixel(player.position);
            behind = p.y < LineY(p.x) && Masked(p);
        }
        alpha = Mathf.MoveTowards(alpha, behind ? fadedAlpha : 1f, fadeSpeed * Time.deltaTime);
        foreach (var r in renderers)
        {
            if (r.gameObject.name == "Shadow") continue;
            Color c = r.color;
            c.a = alpha;
            r.color = c;
        }
    }
}
`],[`export-templates/unity/Editor/TallboyImporter.cs`,`// Tallboy engine pack (format 1): editor importer for Unity 2021.3+.
// Put this file in an Editor folder (Assets/Editor/TallboyImporter.cs) and TallboyBuilding.cs
// anywhere else under Assets/. Unzip the pack under Assets/, then Tools > Tallboy > Import
// engine pack... and pick its building.json. One GameObject per baked angle is created in
// the open scene: sprites (pivot = ground anchor, Sort Point = Pivot), a PolygonCollider2D
// with the footprint, a TallboyBuilding with the occlusion mask, and child transforms for
// doors ("Door N") and lit windows ("Light N").

#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

public static class TallboyImporter
{
    const float PixelsPerUnit = 16f;

    [MenuItem("Tools/Tallboy/Import engine pack...")]
    static void ImportMenu()
    {
        string path = EditorUtility.OpenFilePanel("Tallboy building.json", Application.dataPath, "json");
        if (string.IsNullOrEmpty(path)) return;
        Import(path);
    }

    public static void Import(string jsonPath)
    {
        string full = Path.GetFullPath(jsonPath).Replace('\\\\', '/');
        string assets = Path.GetFullPath(Application.dataPath).Replace('\\\\', '/');
        if (!full.StartsWith(assets))
        {
            Debug.LogError("Tallboy: unzip the pack under Assets/ first.");
            return;
        }
        string dir = "Assets" + Path.GetDirectoryName(full).Replace('\\\\', '/').Substring(assets.Length);
        var data = MiniJson.Parse(File.ReadAllText(full)) as Dictionary<string, object>;
        if (data == null || Num(data["format"]) != 1)
        {
            Debug.LogError("Tallboy: unsupported building.json (format 1 expected).");
            return;
        }
        foreach (var ao in (List<object>)data["angles"])
        {
            var a = (Dictionary<string, object>)ao;
            BuildAngle(data, a, dir);
        }
    }

    static void BuildAngle(Dictionary<string, object> data, Dictionary<string, object> a, string dir)
    {
        var pivot = Vec((List<object>)a["pivot"]);
        var sprite = (Dictionary<string, object>)data["sprite"];
        float w = Num(sprite["w"]);
        float h = Num(sprite["h"]);
        var root = new GameObject($"{data["name"]} a{Num(a["yaw"]):000}");
        Undo.RegisterCreatedObjectUndo(root, "Import Tallboy pack");

        var sprites = (Dictionary<string, object>)a["sprites"];
        int order = 0;
        foreach (var pass in new[] { "Shadow", "Color", "Night", "Outline", "Cutaway" })
        {
            if (!sprites.ContainsKey(pass)) continue;
            var s = LoadSprite(dir + "/" + sprites[pass], new Vector2(pivot.x / w, 1f - pivot.y / h), false);
            var go = new GameObject(pass);
            go.transform.SetParent(root.transform, false);
            var sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = s;
            sr.spriteSortPoint = SpriteSortPoint.Pivot;
            sr.sortingOrder = pass == "Shadow" ? -1 : order++;
            go.SetActive(pass != "Night" && pass != "Cutaway");
        }

        var col = root.AddComponent<PolygonCollider2D>();
        var rings = new List<Vector2[]>();
        // outer rings come first (largest first): rings winding like the first are outer,
        // the others are holes (courtyards)
        float outerSign = 0f;
        foreach (var ro in (List<object>)a["footprint"])
        {
            var ring = new List<Vector2>();
            foreach (var p in (List<object>)ro) ring.Add(ToLocal(Vec((List<object>)p), pivot));
            if (ring.Count < 3) continue;
            float sgn = Mathf.Sign(Area(ring));
            if (outerSign == 0f) outerSign = sgn;
            if (sgn != outerSign) continue;
            rings.Add(ring.ToArray());
        }
        col.pathCount = rings.Count;
        for (int i = 0; i < rings.Count; i++) col.SetPath(i, rings[i]);

        var b = root.AddComponent<TallboyBuilding>();
        b.pixelsPerUnit = PixelsPerUnit;
        b.pivot = pivot;
        var ys = (Dictionary<string, object>)a["ysort"];
        b.ysortA = Vec((List<object>)ys["a"]);
        b.ysortB = Vec((List<object>)ys["b"]);
        b.occlusion = LoadTexture(dir + "/" + a["occlusion"], true);

        int n = 0;
        foreach (var d0 in (List<object>)a["doors"])
        {
            var d = (Dictionary<string, object>)d0;
            var p = new Vector2(Num(d["x"]), Num(d["y"]));
            var go = new GameObject($"Door {n++}");
            go.transform.SetParent(root.transform, false);
            go.transform.localPosition = ToLocal(p, pivot);
            b.doors.Add(p);
        }
        if (a.ContainsKey("lights"))
        {
            n = 0;
            foreach (var l0 in (List<object>)a["lights"])
            {
                var l = (Dictionary<string, object>)l0;
                if (!(bool)l["lit"]) continue;
                var p = new Vector2(Num(l["x"]), Num(l["y"]));
                var go = new GameObject($"Light {n++}");
                go.transform.SetParent(root.transform, false);
                go.transform.localPosition = ToLocal(p, pivot);
                b.litWindows.Add(p);
            }
        }
    }

    static Vector2 ToLocal(Vector2 px, Vector2 pivot) =>
        new Vector2((px.x - pivot.x) / PixelsPerUnit, -(px.y - pivot.y) / PixelsPerUnit);

    static float Area(List<Vector2> r)
    {
        float s = 0;
        for (int i = 0, j = r.Count - 1; i < r.Count; j = i++) s += (r[j].x - r[i].x) * (r[j].y + r[i].y);
        return s * 0.5f;
    }

    static Texture2D LoadTexture(string path, bool readable)
    {
        var ti = AssetImporter.GetAtPath(path) as TextureImporter;
        if (ti != null)
        {
            ti.textureType = TextureImporterType.Default;
            ti.filterMode = FilterMode.Point;
            ti.textureCompression = TextureImporterCompression.Uncompressed;
            ti.isReadable = readable;
            ti.mipmapEnabled = false;
            ti.SaveAndReimport();
        }
        return AssetDatabase.LoadAssetAtPath<Texture2D>(path);
    }

    static Sprite LoadSprite(string path, Vector2 pivot01, bool readable)
    {
        var ti = AssetImporter.GetAtPath(path) as TextureImporter;
        if (ti != null)
        {
            ti.textureType = TextureImporterType.Sprite;
            ti.spriteImportMode = SpriteImportMode.Single;
            ti.spritePixelsPerUnit = PixelsPerUnit;
            ti.filterMode = FilterMode.Point;
            ti.textureCompression = TextureImporterCompression.Uncompressed;
            ti.mipmapEnabled = false;
            ti.isReadable = readable;
            var st = new TextureImporterSettings();
            ti.ReadTextureSettings(st);
            st.spriteAlignment = (int)SpriteAlignment.Custom;
            st.spritePivot = pivot01;
            ti.SetTextureSettings(st);
            ti.SaveAndReimport();
        }
        return AssetDatabase.LoadAssetAtPath<Sprite>(path);
    }

    static float Num(object o) => Convert.ToSingle(o, CultureInfo.InvariantCulture);
    static Vector2 Vec(List<object> l) => new Vector2(Num(l[0]), Num(l[1]));

    /// Minimal JSON reader: objects -> Dictionary, arrays -> List, numbers -> double.
    static class MiniJson
    {
        public static object Parse(string s)
        {
            int i = 0;
            return Value(s, ref i);
        }

        static void Ws(string s, ref int i)
        {
            while (i < s.Length && char.IsWhiteSpace(s[i])) i++;
        }

        static object Value(string s, ref int i)
        {
            Ws(s, ref i);
            char c = s[i];
            if (c == '{')
            {
                var d = new Dictionary<string, object>();
                i++;
                Ws(s, ref i);
                if (s[i] == '}') { i++; return d; }
                while (true)
                {
                    Ws(s, ref i);
                    string k = Str(s, ref i);
                    Ws(s, ref i);
                    i++; // ':'
                    d[k] = Value(s, ref i);
                    Ws(s, ref i);
                    if (s[i++] == '}') return d;
                }
            }
            if (c == '[')
            {
                var l = new List<object>();
                i++;
                Ws(s, ref i);
                if (s[i] == ']') { i++; return l; }
                while (true)
                {
                    l.Add(Value(s, ref i));
                    Ws(s, ref i);
                    if (s[i++] == ']') return l;
                }
            }
            if (c == '"') return Str(s, ref i);
            if (s.Substring(i).StartsWith("true")) { i += 4; return true; }
            if (s.Substring(i).StartsWith("false")) { i += 5; return false; }
            if (s.Substring(i).StartsWith("null")) { i += 4; return null; }
            int st = i;
            while (i < s.Length && "+-0123456789.eE".IndexOf(s[i]) >= 0) i++;
            return double.Parse(s.Substring(st, i - st), CultureInfo.InvariantCulture);
        }

        static string Str(string s, ref int i)
        {
            var sb = new StringBuilder();
            i++; // opening quote
            while (s[i] != '"')
            {
                if (s[i] == '\\\\')
                {
                    i++;
                    char e = s[i];
                    if (e == 'n') sb.Append('\\n');
                    else if (e == 't') sb.Append('\\t');
                    else if (e == 'u') { sb.Append((char)Convert.ToInt32(s.Substring(i + 1, 4), 16)); i += 4; }
                    else sb.Append(e);
                }
                else sb.Append(s[i]);
                i++;
            }
            i++;
            return sb.ToString();
        }
    }
}
#endif
`]]),O=1,k=16,A=e=>e.map(e=>e.map(v)),j=e=>[b(e[0]),b(e[1]),b(e[2])],M=e=>`a${String(Math.round(e)).padStart(3,`0`)}`,N=(e,t,n)=>t.map(t=>t.map(([t,r])=>v(e.project(t,r,n))));function P(e,t,n){let r=e.project(t[0],t[1],t[2]),i=e.project(t[0]+n[0],t[1]+n[1],t[2]+(n[2]??0)),a=i[0]-r[0],o=i[1]-r[1],s=Math.hypot(a,o);return s>1e-9?[b(a/s),b(o/s)]:[0,0]}function F(e,t){let n=e.forward;return t[0]*n[0]+t[1]*n[1]+(t[2]??0)*n[2]<-1e-6}function I(e){let t=[0,0],n=[0,0],r=!0;for(let i of e)for(let e of i){if(r){t=e,n=e,r=!1;continue}(e[0]<t[0]||e[0]===t[0]&&e[1]>t[1])&&(t=e),(e[0]>n[0]||e[0]===n[0]&&e[1]>n[1])&&(n=e)}return{a:[t[0],t[1]],b:[n[0],n[1]]}}function L(e,t,n,r){let i=t.cam,a=d(e.mesh.faces,e.windows,e.layout),o=u(e.mesh,i,i.w,i.h,null,a),s=new Float64Array(n.w*n.h).fill(NaN),c=t.k,l=e.mesh.faces;for(let t=0;t<n.h;t++)for(let i=0;i<n.w;i++){let a=Math.floor((i+n.rect.x)*c+c/2),u=Math.floor((t+n.rect.y)*c+c/2);if(a<0||u<0||a>=o.w||u>=o.h)continue;let d=u*o.w+a,f=o.face[d];if(f===0)continue;let p=l[f-1],m=e.refs[f-1];if(m&&r.has(m.layer)){s[t*n.w+i]=-1/0;continue}s[t*n.w+i]=p.origin[2]+p.uAxis[2]*o.u[d]+p.vAxis[2]*o.v[d]}return s}var R=[`Color`,`Night`,`Outline`,`Cutaway`];function z(e,t){let n=new Uint8Array(e.w*e.h);for(let r of R){let i=e.frames[t]?.[r];if(i)for(let e=0;e<n.length;e++)i.data[e*4+3]>0&&(n[e]=1)}return n}function B(e,t,n,r){let i=e[r];if(!Number.isNaN(i))return i;let a=r%t,o=(r-a)/t,s=NaN;for(let[r,i]of[[0,1],[0,-1],[1,0],[-1,0]]){let c=a+r,l=o+i;if(c<0||l<0||c>=t||l>=n)continue;let u=e[l*t+c];!Number.isNaN(u)&&(Number.isNaN(s)||u>s)&&(s=u)}return s}function V(e,t,n,r){let i=z(e,t),a=new Uint8Array(i.length);for(let t=0;t<i.length;t++)i[t]&&B(n,e.w,e.h,t)>=r+1&&(a[t]=1);return a}function H(e,t,n,r,i){let a=i.map(()=>new Uint8Array(e.length));for(let o=0;o<e.length;o++){if(!e[o])continue;let s=B(t,n,r,o);if(!Number.isFinite(s))continue;let c=0;for(;c+1<i.length&&s>=i[c+1]-1e-6;)c++;a[c][o]=1}return a}function U(e){let{doc:t,scene:n,bake:r,opts:a,name:o}=e,c=C(n.mesh,a,r);w(n.mesh,c).forEach((e,t)=>{let n=r.pivots[t];if(!n||n[0]!==e[0]||n[1]!==e[1])throw Error(`The bake does not match the document: bake again`)});let l=e.edition===`full`&&e.extras?e.extras:null,u=new Set(t.layers.filter(e=>e.street||e.park||e.terrain).map(e=>e.id)),d=y(t,n),S=x(d.map(e=>e.grid)),T=S?_(S):[],D=d.length>0?Math.min(...d.map(e=>e.z0)):0,O=T.length>0?g(T):[0,0,0,0],k=[...new Set(d.flatMap(e=>e.floors.map(e=>Math.round(e*1e3)/1e3)))].sort((e,t)=>e-t),R=new Map(d.map(e=>[e.layer,e.layer])),z=d.flatMap(e=>e.doors.map(t=>({building:e.layer,pos:j(t.pos),dir:v(t.dir),w:t.w,h:t.h,part:t.part}))),B=l?l.lights(t,n).filter(e=>R.has(e.layer)).map(e=>({building:e.layer,pos:j(e.pos),normal:j(e.normal),w:e.w,h:e.h,floor:e.floor,lit:e.lit})):void 0,U=l?l.ground(t):void 0,W=t.credits&&t.credits.length>0?[...t.credits]:void 0,G=W?{Copyright:W.join(`; `)}:void 0,K=new Map,q=c.map((e,t)=>{let i=M(e.yaw),a={};for(let e of r.passes){let n=r.frames[t]?.[e];if(!n)continue;let c=`sprites/${o}_${e.toLowerCase()}_${i}.png`;K.set(c,s(n,G)),a[e]=c}let c;if(r.maps&&r.maps.order.length>0){c={};for(let e of r.maps.order){let n=h(r.maps,t,e);if(!n)continue;let a=`sprites/${o}_${f(e)}_${i}.png`,l=e===`Depth`?p(r.maps,t,r.w,r.h,G):null;K.set(a,l??s(n,G)),c[f(e)]=a}}let m=L(n,e,r,u),g=V(r,t,m,D),_=`masks/${o}_occlusion_${i}.png`;K.set(_,E(g,r.w,r.h,G));let y;l&&k.length>1&&(y=H(g,m,r.w,r.h,k).map((e,t)=>{let n=`masks/${o}_floor${t}_${i}.png`;return K.set(n,E(e,r.w,r.h,G)),n}));let x=N(e,T,D),S=I(x),C=[r.pivots[t][0],r.pivots[t][1]],w={index:t,yaw:e.yaw,sprites:a,occlusion:_,...c?{maps:c}:{},...y?{floors:y}:{},pivot:C,ysort:{...S,y:b((S.a[1]+S.b[1])/2)},footprint:x,collision:[[O[0],O[1]],[O[2],O[1]],[O[2],O[3]],[O[0],O[3]]].map(([t,n])=>v(e.project(t,n,D))),buildings:d.map(t=>({id:t.layer,footprint:N(e,t.rings,t.z0)})),doors:z.map(t=>{let n=e.project(t.pos[0],t.pos[1],t.pos[2]);return{x:b(n[0]),y:b(n[1]),dir:P(e,t.pos,[t.dir[0],t.dir[1],0]),facing:F(e.cam,[t.dir[0],t.dir[1],0])}})};return B&&(w.lights=B.map(t=>{let n=e.project(t.pos[0],t.pos[1],t.pos[2]);return{x:b(n[0]),y:b(n[1]),lit:t.lit,facing:F(e.cam,t.normal)}})),U&&(w.ground=U.map(t=>({id:t.layer,regions:t.regions.map(t=>({cls:t.cls,rings:N(e,t.rings,0)}))}))),w}),J,Y=r.maps;if(Y&&Y.order.length>0){let e=Y.order.map(f),t;Y.materials&&(t=`sprites/${o}_materials.json`,K.set(t,i(m(Y.materials)))),J={names:e,...Y.order.includes(`Normal`)?{normal:Y.modes?.normalY===`dx`?`directx`:`opengl`}:{},...Y.order.includes(`Depth`)?{depth:{mode:Y.modes?.depth??`height`,bits:Y.depth16?16:8}}:{},...Y.order.includes(`Emissive`)?{emissive:Y.modes?.emissive??`color`}:{},...t?{materials:t}:{}}}let X=a.camera,Z={format:1,generator:`Tallboy Web`,...e.version?{version:e.version}:{},edition:e.edition,name:o,units:{texelsPerMeter:16,up:`z`,pixelOrigin:`top-left`,pixelYDown:!0},camera:{projection:X.proj,yaw:b(X.yaw),pitch:b(X.pitch),density:b(c[0]?.cam.density??X.density),heightScale:b(X.heightScale)},sprite:{w:r.w,h:r.h,passes:[...r.passes],canvas:a.canvas.w,supersample:a.supersample??1},...J?{maps:J}:{},...W?{credits:W}:{},ground_z:b(D),footprint:A(T),collision:{min:v([O[0],O[1]]),max:v([O[2],O[3]])},floors:k,buildings:d.map(e=>({id:e.layer,name:e.name,footprint:A(e.rings),z0:b(e.z0),z1:b(e.z1),floors:e.floors.map(b)})),doors:z,...B?{lights:B}:{},...U?{ground:U.map(e=>({id:e.layer,name:e.name,kind:e.kind,regions:e.regions.map(e=>({...e,rings:A(e.rings)}))}))}:{},angles:q};return e.stages&&e.stages.length>0&&(Z.stages=e.stages.map(e=>({name:e.name,w:e.bake.w,h:e.bake.h,angles:e.bake.frames.map((t,n)=>{let r=M(e.bake.angles[n]??0),i={};for(let n of e.bake.passes){let a=t[n];if(!a)continue;let c=`stages/${o}_${e.name}_${n.toLowerCase()}_${r}.png`;K.set(c,s(a,G)),i[n]=c}return{index:n,pivot:[e.bake.pivots[n][0],e.bake.pivots[n][1]],sprites:i}})}))),{json:Z,files:K}}function W(e){let t={"building.json":i(`${JSON.stringify(e.json,null,2)}\n`)};for(let[n,r]of e.files)t[n]=[r,{level:0}];for(let[e,n]of D)t[e]=i(n);return r(t,{level:6,mtime:o})}function G(e){return{bytes:W(U(e)),fileName:`${e.name}.engine.zip`}}export{O as ENGINE_PACK_FORMAT,k as TEXELS_PER_METER,U as buildEnginePack,G as exportEnginePack,H as floorMasks,V as occlusionMask,I as ysortLine,W as zipEnginePack};