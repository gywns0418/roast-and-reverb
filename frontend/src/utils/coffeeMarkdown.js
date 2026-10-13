function sectionsOf(text) {
  const sections = {};
  let heading = "";
  for (const line of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const match = line.match(/^###\s+(.+?)\s*$/);
    if (match) {
      heading = match[1];
      sections[heading] = [];
    } else if (heading) sections[heading].push(line);
  }
  return sections;
}

function fieldsOf(lines = []) {
  const fields = {};
  for (const line of lines) {
    const match = line.match(/^\s*-\s+([^:：]+)[:：]\s*(.*)$/);
    if (match) fields[match[1].trim()] = match[2].trim();
  }
  return fields;
}

function measured(value, unit) {
  if (!value) return null;
  const match = value.match(new RegExp(`^\\s*(\\d+(?:\\.\\d+)?)\\s*${unit}`));
  return match ? Number(match[1]) : null;
}

function exactSeconds(text = "") {
  const clock = text.match(/^(\d+):(\d{2})(?:\s|$)/);
  if (clock && Number(clock[2]) < 60)
    return Number(clock[1]) * 60 + Number(clock[2]);
  const korean = text.match(/^(?:(\d+)분\s*)?(?:(\d+)초)(?:\s|$)/);
  return korean ? Number(korean[1] || 0) * 60 + Number(korean[2]) : null;
}

function validDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

export function parseCoffeeMarkdown(text, filename = "") {
  const sections = sectionsOf(text);
  const bean = fieldsOf(sections["원두"]);
  const conditions = fieldsOf(sections["추출 조건"]);
  const recipe = fieldsOf(sections["레시피"]);
  const taste = fieldsOf(sections["마셨을 때"]);
  const satisfaction = fieldsOf(sections["만족도"]);
  const dateText = (sections["날짜"] || []).join(" ");
  const date =
    dateText.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ||
    filename.match(/^(\d{4}-\d{2}-\d{2})(?:-\d+)?\.md$/i)?.[1];
  const errors = [];
  if (!validDate(date)) errors.push("기록 날짜를 확인할 수 없습니다.");
  if (!bean["이름"]) errors.push("원두 이름이 없습니다.");
  const hour = dateText.match(/(?:\s|^)(\d{1,2})시/)?.[1];
  const pourText = recipe["개별 푸어량"] || recipe["누적 푸어량"] || "";
  const observations = taste["전체 인상"] || satisfaction["한 줄 메모"] || "";
  const details = {
    doseGrams: measured(conditions["원두량"], "g"),
    waterGrams: measured(conditions["물"], "g"),
    beverageGrams: measured(
      recipe["실제 서버로 내려온 양"] ||
        recipe["총 추출량"] ||
        conditions["총 추출량"],
      "g",
    ),
    recordedHour:
      hour !== undefined && Number(hour) <= 23 ? Number(hour) : null,
    dripper: conditions["드리퍼"] || "",
    filter: conditions["필터"] || "",
    grinder: conditions["그라인더"] || "",
    roastDate: bean["로스팅 날짜"]?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "",
    openedDate: bean["개봉 날짜"]?.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "",
    pourText,
    pourMode: recipe["개별 푸어량"] ? "individual" : "cumulative",
    recipeText: (sections["레시피"] || []).join("\n").trim(),
    brewTimeText: recipe["총 추출 시간"] || "",
    coolingNotes: taste["식으면서 달라진 점"] || "",
    aftertaste: taste["후미"] || "",
    ratingText: satisfaction["별점"] || "",
    wouldRepeat: satisfaction["다시 마시고 싶은가"] || "",
    sensoryNotes: {
      sweetness: taste["단맛"] || "",
      acidity: taste["산미"] || "",
      body: taste["바디"] || "",
      aroma: taste["향미"] || taste["향"] || "",
    },
    nextExperiment: satisfaction["다음 잔에서 바꿔볼 것"] || "",
    analysisNotes: (sections["분석 및 다음 실험"] || []).join("\n").trim(),
    sourceFile: filename,
  };
  return {
    errors,
    coffee: {
      beanName: bean["이름"] || "",
      roastery: bean["로스터리"] || "",
      originCountry: bean["원산지"] || "",
      process: bean["가공 방식"] || "",
      brewMethod: "",
      roastLevel: "",
      drinkDate: date || "",
      grindSize: conditions["분쇄도"] || "",
      waterTemp: measured(conditions["물 온도"], "(?:℃|°C|도)"),
      brewTime: exactSeconds(recipe["총 추출 시간"]),
      tasteNote: taste["향미"] || taste["향"] || observations,
      memo: satisfaction["한 줄 메모"] || observations,
      acidity: null,
      sweetness: null,
      bitterness: null,
      body: null,
      aroma: null,
      brewDetails: details,
    },
  };
}
