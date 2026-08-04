"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Question = {
  id: string;
  category: string;
  exam: "第67回" | "第63回";
  question: string;
  answer: string;
  why: string;
};

const THEMES = [
  "67 基礎",
  "67 scanf",
  "67 分岐",
  "67 演算子",
  "67 printf",
  "67 配列",
  "63 基礎",
  "63 macro",
  "63 分岐",
  "63 前後置",
  "63 printf",
  "63 文字列",
] as const;

const q = (
  id: string,
  category: string,
  exam: Question["exam"],
  question: string,
  answer: string,
  why: string,
): Question => ({ id, category, exam, question, answer, why });

const QUESTIONS: Question[] = [
  q("01", "67 基礎", "第67回", "unsigned int は、符号なし整数型を表す。", "ア｜正しい", "unsigned を付けると符号なし整数型になる。"),
  q("02", "67 基礎", "第67回", "プログラム開始時に呼ばれる関数名は、自由に決められる。", "イ｜誤り", "通常のCプログラムの開始関数は main。"),
  q("03", "67 基礎", "第67回", "C言語の文字列定数は、ナル文字（\\0）で終わる文字の列である。", "ア｜正しい", "文字列の終端にはナル文字 \\0 が置かれる。"),
  q("04", "67 基礎", "第67回", "文字定数でシングルクォートを表す記述は？", "'\\''", "区切り記号そのものは \\ でエスケープする。"),
  q("05", "67 基礎", "第67回", "/* と */ の間のコメントは、複数行には書けない。", "イ｜誤り", "ブロックコメントは複数行にまたがって書ける。"),
  q("06", "67 基礎", "第67回", "a = a - 5; と a -= 5; は等価である。", "ア｜正しい", "複合代入の x op= y は x = x op y と同じ。"),
  q("07", "67 基礎", "第67回", "Cには、ループ本体の後に条件を評価する文はない。", "イ｜誤り", "do ... while は本体を実行した後に条件を評価する。"),
  q("08", "67 基礎", "第67回", "x++; と書くと、x の値を1増やせる。", "ア｜正しい", "++ はインクリメント演算子。"),

  q("09", "67 scanf", "第67回", "scanf が書式付きデータを読み取る場所は？", "標準入力", "通常はキーボードからの標準入力を読み取る。"),
  q("10", "67 scanf", "第67回", "10進の符号付き整数を入力する変換指定子は？", "%d", "d は decimal。int などへ符号付き10進整数として入力する。"),
  q("11", "67 scanf", "第67回", "10進の符号なし整数を入力する変換指定子は？", "%u", "u は unsigned。"),
  q("12", "67 scanf", "第67回", "8進の符号なし整数を入力する変換指定子は？", "%o", "o は octal（8進）。"),
  q("13", "67 scanf", "第67回", "16進の符号なし整数を入力する変換指定子は？", "%x", "x は hexadecimal（16進）。"),

  q("14", "67 分岐", "第67回", "v=10。独立した2つの if で x に7、次に2を加える。x は？", "9", "2つの if は両方とも真。0 + 7 + 2 = 9。"),
  q("15", "67 分岐", "第67回", "v=10。if (v>7) で7を加え、else if (v==10) で2を加える。x は？", "7", "最初の条件が真なら else if は評価されない。"),
  q("16", "67 分岐", "第67回", "最初の分岐後に x=7。x*2>10 なら3を加える。x は？", "10", "7×2>10 は真なので、7 + 3 = 10。"),
  q("17", "67 分岐", "第67回", "a=9, b=-5, c=3 の入れ子 if。最終的な a は？", "12", "c は最終的に-3。a = 9 - (-3) = 12。"),
  q("18", "67 分岐", "第67回", "同じ入れ子 if で、最終的な b は？", "7", "途中で b=10、最後に c=-3 を加えて 7。"),
  q("19", "67 分岐", "第67回", "同じ入れ子 if で、最終的な c は？", "-3", "c は 3 - 9 + 3 = -3。"),
  q("20", "67 分岐", "第67回", "t={1,2,3,0} を走査後、j=t[1]。t[j]<3 の分岐後の r は？", "14", "j=2、t[2]=3。3<3 は偽なので r が15から1減る。"),
  q("21", "67 分岐", "第67回", "同じ配列追跡で、最終的な s は？", "11", "最後の条件は偽なので s は変化しない。"),

  q("22", "67 演算子", "第67回", "論理積（AND）の演算子は？", "&&", "両方が真のときに真になる。"),
  q("23", "67 演算子", "第67回", "論理和（OR）の演算子は？", "||", "少なくとも一方が真なら真になる。"),
  q("24", "67 演算子", "第67回", "論理否定（NOT）の演算子は？", "!", "真偽を反転する。"),
  q("25", "67 演算子", "第67回", "&& と || では、どちらの優先順位が高い？", "&&（論理積）", "&& が先に評価される。迷うときは括弧で明示する。"),
  q("26", "67 演算子", "第67回", "i=8; a=i++; の直後、a は？", "8", "後置 ++ は現在値を使ってから i を1増やす。"),
  q("27", "67 演算子", "第67回", "j=9; b=++j; の直後、b は？", "10", "前置 ++ は先に増やしてから式の値にする。"),

  q("28", "67 printf", "第67回", "printf(\"[%-3d]\", 62); の出力は？（△は空白）", "[62△]", "幅3・左寄せなので、末尾に空白が1個入る。"),
  q("29", "67 printf", "第67回", "printf(\"[%05d]\", 1961); の出力は？", "[01961]", "幅5で0埋め。4桁の前に0が1個入る。"),
  q("30", "67 printf", "第67回", "printf(\"[%04x]\", 0xf2c); の出力は？", "[0f2c]", "%x は小文字16進。幅4まで0で埋める。"),
  q("31", "67 printf", "第67回", "printf(\"[%4s]\", \"CAMERA\"); の出力は？", "[CAMERA]", "幅は最小幅。長い文字列は切り詰めない。"),
  q("32", "67 printf", "第67回", "printf(\"[%-5.3s]\", \"GRAPHIC\"); の出力は？", "[GRA△△]", ".3s で3文字、幅5・左寄せで後ろに空白2個。"),

  q("33", "67 配列", "第67回", "入力が0〜999のとき、最小値を記録する要素の初期値は？", "1000", "範囲より大きくして、最初の入力で必ず更新させる。"),
  q("34", "67 配列", "第67回", "入力が0〜999のとき、最大値を記録する要素の初期値は？", "-1", "範囲より小さくして、最初の入力で必ず更新させる。"),
  q("35", "67 配列", "第67回", "最小値を更新する比較式は？", "cnt[h][i] < min[i*2]", "現在値が記録済みの最小値より小さいときに更新する。"),
  q("36", "67 配列", "第67回", "値を min[i*2] に置くとき、対応する時刻の添字は？", "i*2 + 1", "配列を［値, 時刻］のペアで使う。"),
  q("37", "67 配列", "第67回", "最大値を更新する比較式は？", "cnt[h][i] > max[i*2]", "現在値が記録済みの最大値より大きいときに更新する。"),

  q("63-01", "63 基礎", "第63回", "式を伴う return は、その式の値を呼び出し元へ返せる。", "ア｜正しい", "return 式; の値が関数呼び出し式の値になる。"),
  q("63-02", "63 基礎", "第63回", "a = b = 5; は、先に b を5にしてから a に b を代入するのと同じ。", "ア｜正しい", "代入は右から左へ評価され、両方が5になる。"),
  q("63-03", "63 基礎", "第63回", "tolower は英大文字を英小文字にする標準ライブラリ関数。", "ア｜正しい", "<ctype.h> の tolower は対応する小文字へ変換する。"),
  q("63-04", "63 基礎", "第63回", "switch の制御式に文字列を直接指定できる。", "イ｜誤り", "switch は整数型・列挙型などで分岐する。"),
  q("63-05", "63 基礎", "第63回", "文字列中の水平タブは \\t と記述する。", "ア｜正しい", "エスケープシーケンス \\t は水平タブを表す。"),
  q("63-06", "63 基礎", "第63回", "isxdigit は8進数字を判定する関数。", "イ｜誤り", "isxdigit は16進数字（0-9, A-F, a-f）を判定する。"),
  q("63-07", "63 基礎", "第63回", "文字列リテラル内の /* ... */ はコメントとして扱われる。", "イ｜誤り", "文字列の中では / や * もただの文字。"),
  q("63-08", "63 基礎", "第63回", "putchar の宣言は stdio.h にある。", "ア｜正しい", "putchar は標準入出力の関数。"),

  q("63-09", "63 macro", "第63回", "MACRO を文字列 Small と定義して %s に渡したときの出力は？", "Small", "マクロ名は文字列リテラルへ置き換わる。"),
  q("63-10", "63 macro", "第63回", "文字配列 macro に Large を入れ、%s で出力した結果は？", "Large", "大文字の MACRO と小文字の変数 macro は別物。"),
  q("63-11", "63 macro", "第63回", "文字列リテラル \"MACRO\" を %s で出力した結果は？", "MACRO", "引用符の中はプリプロセッサの置換対象にならない。"),
  q("63-12", "63 macro", "第63回", "x=4, y=5。括弧なしの x+y を3倍するマクロの結果は？", "19", "展開後は x + y * 3。乗算が先で 4 + 15。"),
  q("63-13", "63 macro", "第63回", "x=4, y=5。括弧付きの (x+y) を3倍する結果は？", "27", "(4 + 5) * 3 = 27。マクロの式は括弧で守る。"),

  q("63-14", "63 分岐", "第63回", "v=10。独立した2つの if が x に7と2を加える。x は？", "9", "2つの if は独立しているので両方実行される。"),
  q("63-15", "63 分岐", "第63回", "v=10。if / else if の最初の条件が真。x は？", "7", "最初の if が真なら else if は評価されない。"),
  q("63-16", "63 分岐", "第63回", "x=7 の後、x*2>10 なら3を足す。x は？", "10", "7×2>10 は真なので 7+3。"),
  q("63-17", "63 分岐", "第63回", "a=9, b=-5, c=3 の入れ子分岐。最後の a は？", "12", "最終的な c=-3 を a から引き、9-(-3)。"),
  q("63-18", "63 分岐", "第63回", "同じ入れ子分岐で、最後の b は？", "7", "途中で10になり、最後に-3を加える。"),
  q("63-19", "63 分岐", "第63回", "同じ入れ子分岐で、最後の c は？", "-3", "3 - 9 + 3 = -3。"),
  q("63-20", "63 分岐", "第63回", "配列の値を次の添字としてたどる分岐。r の最終値は？", "14", "最後の比較が偽になり、r だけが1減る。"),
  q("63-21", "63 分岐", "第63回", "同じ配列追跡で、s の最終値は？", "11", "最後の条件では s は変更されない。"),

  q("63-22", "63 前後置", "第63回", "減算前の値を式で使ってから1減らす演算子は？", "後置デクリメント（x--）", "x-- は現在値を使った後で x を1減らす。"),
  q("63-23", "63 前後置", "第63回", "先に1減らした値を式で使う演算子は？", "前置デクリメント（--x）", "--x は先に x を1減らして、その値を使う。"),
  q("63-24", "63 前後置", "第63回", "i=7 のとき a=--i; の a は？", "6", "前置なので i を先に6にしてから代入する。"),
  q("63-25", "63 前後置", "第63回", "j=2 のとき b=j--; の b は？", "2", "後置なので2を代入してから j が1になる。"),
  q("63-26", "63 前後置", "第63回", "j=1, k=5 のとき c=j+k++; の c は？", "6", "式では増加前の5を使う。k は式の後で6になる。"),
  q("63-27", "63 前後置", "第63回", "i=6, k=6 のとき d=++k+i--; の d は？", "13", "++k は7、i-- は増減前の6を使う。"),

  q("63-28", "63 printf", "第63回", "[%-5d] に407を出力した結果は？（△は空白）", "[407△△]", "幅5・左寄せ。末尾を空白2個で埋める。"),
  q("63-29", "63 printf", "第63回", "[%04d] に942を出力した結果は？", "[0942]", "幅4で0埋め。先頭に0が1個入る。"),
  q("63-30", "63 printf", "第63回", "[%03X] に16進数5fを出力した結果は？", "[05F]", "%X は大文字16進。幅3まで0で埋める。"),
  q("63-31", "63 printf", "第63回", "[%-5s] に Artificial を出力した結果は？", "[Artificial]", "幅は最小幅。長い文字列は切り詰めない。"),
  q("63-32", "63 printf", "第63回", "[%7.3s] に Intelligence を出力した結果は？", "[△△△△Int]", ".3で3文字にし、幅7まで左側を空白で埋める。"),

  q("63-33", "63 文字列", "第63回", "入力文字 ch が % のときだけ置換処理へ入る条件は？", "ch == '%'", "% だけを特別に扱い、通常文字はそのままコピーする。"),
  q("63-34", "63 文字列", "第63回", "% の次を読んだ直後、文字列末尾なら終了する条件は？", "ch == '\\0'", "% が最後なら、次の文字は終端ナル文字。"),
  q("63-35", "63 文字列", "第63回", "対応表から一致を見つけた直後、探索を終える命令は？", "break", "一致後はループを抜け、探し続けない。"),
  q("63-36", "63 文字列", "第63回", "対応表の0〜4で見つかったときだけ置換文字列を出す条件は？", "n < 5", "見つからない場合は n=5。0〜4だけが有効。"),
  q("63-37", "63 文字列", "第63回", "通常文字を出力用配列へ1文字コピーする代入は？", "out[j] = ch", "置換対象でない文字は ch をそのまま格納する。"),
];

const STORAGE_KEY = "c-grade3-reviewed";
const FLOW_SPEEDS = [
  { label: "ゆっくり", value: 22 },
  { label: "ふつう", value: 40 },
  { label: "はやい", value: 68 },
] as const;

export default function Home() {
  const [activeTheme, setActiveTheme] = useState("すべて");
  const [query, setQuery] = useState("");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [flowActive, setFlowActive] = useState(false);
  const [flowPaused, setFlowPaused] = useState(false);
  const [flowSpeed, setFlowSpeed] = useState(40);
  const flowFrame = useRef<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setReviewed(new Set(JSON.parse(saved)));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return QUESTIONS.filter((item) => {
      const themeMatch = activeTheme === "すべて" || item.category === activeTheme;
      const textMatch =
        !needle ||
        [item.id, item.category, item.question, item.answer, item.why]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return themeMatch && textMatch;
    });
  }, [activeTheme, query]);

  const allVisibleOpen = filtered.length > 0 && filtered.every((item) => revealed.has(item.id));
  const progress = Math.round((reviewed.size / QUESTIONS.length) * 100);

  useEffect(() => {
    if (!flowActive || flowPaused) return;

    let previous = window.performance.now();
    let loopAt = 0;

    const move = (now: number) => {
      const elapsed = Math.min(now - previous, 50);
      previous = now;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

      if (atBottom) {
        if (!loopAt) loopAt = now + 1600;
        if (now >= loopAt) {
          const questionsTop = document.getElementById("questions")?.offsetTop ?? 0;
          window.scrollTo({ top: questionsTop, behavior: "auto" });
          loopAt = 0;
        }
      } else {
        loopAt = 0;
        window.scrollBy({ top: (flowSpeed * elapsed) / 1000, behavior: "auto" });
      }

      flowFrame.current = window.requestAnimationFrame(move);
    };

    flowFrame.current = window.requestAnimationFrame(move);
    return () => {
      if (flowFrame.current !== null) window.cancelAnimationFrame(flowFrame.current);
      flowFrame.current = null;
    };
  }, [flowActive, flowPaused, flowSpeed]);

  useEffect(() => {
    if (!flowActive) return;
    const stopWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFlowActive(false);
        setFlowPaused(false);
      }
    };
    window.addEventListener("keydown", stopWithEscape);
    return () => window.removeEventListener("keydown", stopWithEscape);
  }, [flowActive]);

  function toggleAnswer(id: string) {
    setRevealed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setRevealed((current) => {
      const next = new Set(current);
      if (allVisibleOpen) filtered.forEach((item) => next.delete(item.id));
      else filtered.forEach((item) => next.add(item.id));
      return next;
    });
  }

  function toggleReviewed(id: string) {
    setReviewed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function jumpRandom() {
    if (!filtered.length) return;
    const item = filtered[Math.floor(Math.random() * filtered.length)];
    setRevealed((current) => new Set(current).add(item.id));
    window.setTimeout(() => {
      document.getElementById(`q-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  }

  function startFlow() {
    if (!filtered.length) return;
    setRevealed((current) => {
      const next = new Set(current);
      filtered.forEach((item) => next.add(item.id));
      return next;
    });
    setFlowPaused(false);
    const questionsTop = document.getElementById("questions")?.offsetTop ?? 0;
    window.scrollTo({ top: questionsTop, behavior: "auto" });
    setFlowActive(true);
  }

  function stopFlow() {
    setFlowActive(false);
    setFlowPaused(false);
  }

  return (
    <main>
      <header className="hero">
        <nav className="topbar" aria-label="サイト情報">
          <a className="brand" href="#top" aria-label="ページ先頭へ">
            C<span>/</span>03
          </a>
          <p>第63回 + 第67回</p>
          <p className="top-status">{reviewed.size.toString().padStart(2, "0")} / 74 済</p>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">LAST-MINUTE RECALL / C LANGUAGE GRADE 3</p>
            <h1>
              C言語3級
              <span>一夜漬け 74問</span>
            </h1>
            <p className="hero-lead">
              問題を流す。答えを隠す。迷ったところだけ、もう一度。
              <br />
              第63回・第67回の要点を、1行の根拠までまとめました。
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#questions">
                手動で流し見する <span>↓</span>
              </a>
              <button className="flow-launch" type="button" onClick={startFlow}>
                <i aria-hidden="true" /> 自動流し見 ▶
              </button>
              <button className="text-button" type="button" onClick={jumpRandom}>
                ランダムに1問 ↗
              </button>
            </div>
          </div>

          <div className="score-panel" aria-label="学習状況">
            <div className="score-number">74</div>
            <div className="score-copy">
              <span>QUESTIONS</span>
              <strong>{progress}%</strong>
              <small>CHECKED</small>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="recall-strip" aria-label="覚え方の要点">
          <span>01</span><p>後判定は <strong>do...while</strong></p>
          <span>02</span><p><strong>&amp;&amp;</strong> が || より先</p>
          <span>03</span><p><strong>i++</strong> は使ってから</p>
          <span>04</span><p><strong>-</strong> 左寄せ / <strong>0</strong> 埋め</p>
        </div>
      </header>

      <section className="study" id="questions">
        <div className="study-heading">
          <div>
            <p className="eyebrow lime">FLASH RECALL</p>
            <h2>答えは、タップして開く。</h2>
          </div>
          <div className="study-actions">
            <button className="flow-start" type="button" onClick={startFlow} disabled={!filtered.length}>
              自動流し見を開始 ▶
            </button>
            <button className="all-toggle" type="button" onClick={toggleAll} disabled={!filtered.length}>
              {allVisibleOpen ? "表示中の答えを隠す" : "表示中の答えをすべて開く"}
            </button>
          </div>
        </div>

        <div className="filters" aria-label="問題の絞り込み">
          <div className="theme-list">
            {["すべて", ...THEMES].map((theme) => (
              <button
                className={activeTheme === theme ? "theme-chip active" : "theme-chip"}
                type="button"
                key={theme}
                onClick={() => setActiveTheme(theme)}
                aria-pressed={activeTheme === theme}
              >
                {theme}
              </button>
            ))}
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">問題を検索</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="番号・用語で検索"
            />
          </label>
        </div>

        <div className="results-line">
          <p><strong>{filtered.length}</strong> / 74 QUESTIONS</p>
          <button type="button" onClick={jumpRandom} disabled={!filtered.length}>RANDOM ↗</button>
        </div>

        <div className="question-list">
          {filtered.map((item) => {
            const isOpen = flowActive || revealed.has(item.id);
            const isDone = reviewed.has(item.id);
            return (
              <article className={isOpen ? "question-card open" : "question-card"} id={`q-${item.id}`} key={item.id}>
                <div className="card-index">
                  <span>{item.id}</span>
                  <small>{item.exam}</small>
                </div>
                <div className="card-content">
                  <span className="category-tag">{item.category}</span>
                  <h3>{item.question}</h3>
                  <div id={`answer-${item.id}`} className={isOpen ? "answer visible" : "answer"} aria-hidden={!isOpen}>
                    <p className="answer-label">ANSWER</p>
                    <p className="answer-value">{item.answer}</p>
                    <p className="answer-why"><span>WHY</span>{item.why}</p>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className={isDone ? "check-button checked" : "check-button"}
                    type="button"
                    onClick={() => toggleReviewed(item.id)}
                    aria-pressed={isDone}
                    aria-label={`${item.id}を復習済みに${isDone ? "しない" : "する"}`}
                  >
                    {isDone ? "✓" : "○"}
                  </button>
                  <button
                    className="reveal-button"
                    type="button"
                    onClick={() => toggleAnswer(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`answer-${item.id}`}
                  >
                    <span>{isOpen ? "答えを隠す" : "答えを見る"}</span>
                    <b aria-hidden="true">{isOpen ? "−" : "+"}</b>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!filtered.length && (
          <div className="empty-state">
            <strong>NO MATCH</strong>
            <p>検索語かカテゴリを変えてください。</p>
          </div>
        )}
      </section>

      <section className="final-note">
        <p className="eyebrow">FINAL 90 SECONDS</p>
        <div>
          <h2>答えだけでなく、<br />1行の理由まで。</h2>
          <p>全部覚えなくていい。迷ったカードにだけチェックを残し、そこだけもう一周。</p>
        </div>
        <a href="#top">TOP ↑</a>
      </section>

      <footer>
        <p>C LANGUAGE / GRADE 3 / NO.63 + NO.67</p>
        <p>74 QUESTIONS — QUICK RECALL EDITION</p>
      </footer>

      {flowActive && (
        <aside className="flow-dock" aria-label="自動流し見モード">
          <span className={flowPaused ? "flow-status paused" : "flow-status"} aria-hidden="true" />
          <div className="flow-copy" aria-live="polite">
            <strong>AUTO FLOW</strong>
            <small>{flowPaused ? "一時停止中" : "問題と答えを自動スクロール中"}</small>
          </div>
          <div className="speed-buttons" aria-label="スクロール速度">
            {FLOW_SPEEDS.map((speed) => (
              <button
                type="button"
                key={speed.value}
                className={flowSpeed === speed.value ? "active" : ""}
                onClick={() => setFlowSpeed(speed.value)}
                aria-pressed={flowSpeed === speed.value}
              >
                {speed.label}
              </button>
            ))}
          </div>
          <button className="flow-pause" type="button" onClick={() => setFlowPaused((current) => !current)}>
            {flowPaused ? "再開 ▶" : "一時停止 Ⅱ"}
          </button>
          <button className="flow-stop" type="button" onClick={stopFlow} aria-label="自動流し見を終了">
            終了 ×
          </button>
        </aside>
      )}
    </main>
  );
}
