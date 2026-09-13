# 무지개 놀이터 발음 클립 생성 (edge-tts, ko-KR-SunHiNeural: 밝은 여성 목소리)
import asyncio, re, os, sys, json
import edge_tts

APP = r"C:\dev\9th yeolmu\rainbow-app"
OUT = os.path.join(APP, "audio")
os.makedirs(OUT, exist_ok=True)
VOICE, RATE, PITCH = "ko-KR-SunHiNeural", "-20%", "+25Hz"

def safe(t):
    return re.sub(r"[.?!,]", "", t).strip().replace(" ", "_")

texts = set()
for f in ["hangul.html", "index.html", "arcade.html"]:
    p = os.path.join(APP, f)
    if not os.path.exists(p): continue
    src = open(p, encoding="utf-8").read()
    # WORDS: ['사과','🍎'] 꼴, SENTS: ['사과','문장.'] 꼴, ONOMAT: ['개굴개굴','개구리','🐸'] 꼴
    for m in re.finditer(r"\['([가-힣]+)','([^']+)'(?:,'([^']+)')?\]", src):
        texts.add(m.group(1))
        for g in (m.group(2), m.group(3)):
            if g and re.search(r"[가-힣]", g) and not re.search(r"[\U0001F000-\U0001FFFF]", g):
                texts.add(g)
    for m in re.finditer(r"\['(반대말|비슷한말)?:?([가-힣]+)','([가-힣]+)'\]", src):
        texts.add(m.group(2)); texts.add(m.group(3))
    for m in re.finditer(r"\[\['([가-힣]+)','([가-힣]+)'\]", src):
        texts.add(m.group(1)); texts.add(m.group(2))
PHRASES = ["일반 친구를 만났어요!", "희귀 친구를 만났어요!", "영웅 친구를 만났어요!", "전설 친구를 만났어요!", "신화 친구를 만났어요!", "새 친구를 만났어요!", "안녕! 나는 소화 놀이터 친구야", "어서 와요!", "잘했어요!", "다시 한번 해 봐요"]
texts.update(PHRASES)
texts = sorted(t for t in texts if 1 <= len(t) <= 40)
print("texts:", len(texts))

async def one(sem, t):
    path = os.path.join(OUT, safe(t) + ".mp3")
    if os.path.exists(path) and os.path.getsize(path) > 1000: return
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(t, VOICE, rate=RATE, pitch=PITCH).save(path)
                return
            except Exception as e:
                await asyncio.sleep(1.5 * (attempt + 1))
        print("FAILED", t, file=sys.stderr)

async def main():
    sem = asyncio.Semaphore(6)
    await asyncio.gather(*(one(sem, t) for t in texts))
    keep = {safe(t) + ".mp3" for t in texts}
    for f in os.listdir(OUT):
        if f.endswith(".mp3") and f not in keep: os.remove(os.path.join(OUT, f))   # 이제 쓰지 않는 파일은 지워요
    files = [f for f in os.listdir(OUT) if f.endswith(".mp3")]
    total = sum(os.path.getsize(os.path.join(OUT, f)) for f in files)
    json.dump(sorted(f[:-4] for f in files), open(os.path.join(OUT, "list.json"), "w", encoding="utf-8"), ensure_ascii=False)
    print("files:", len(files), "MB:", round(total / 1e6, 1))

asyncio.run(main())
