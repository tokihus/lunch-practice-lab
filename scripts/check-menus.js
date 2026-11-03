// 메뉴 데이터 검사: site/menus.json의 형식과 필수 항목을 확인한다.
// PR이 열리면 GitHub Actions(.github/workflows/check.yml)가 이 파일을 실행한다.
const fs = require("fs");

const FILE = "site/menus.json";
const errors = [];

let menus;
try {
  menus = JSON.parse(fs.readFileSync(FILE, "utf8"));
} catch (e) {
  console.error(`[실패] ${FILE}이 올바른 JSON 형식이 아닙니다.`);
  console.error(`       쉼표, 따옴표, 괄호가 빠지지 않았는지 확인하세요.`);
  console.error(`       자세한 내용: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(menus)) {
  console.error(`[실패] ${FILE}은 [ ]로 감싼 목록이어야 합니다.`);
  process.exit(1);
}

menus.forEach((m, i) => {
  const where = `${i + 1}번째 메뉴(${m && m.name ? m.name : "이름 없음"})`;
  if (typeof m.name !== "string" || m.name.trim() === "") errors.push(`${where}: name(메뉴 이름)이 없습니다.`);
  if (typeof m.category !== "string" || m.category.trim() === "") errors.push(`${where}: category(종류)가 없습니다.`);
  if (typeof m.price !== "number" || m.price <= 0) errors.push(`${where}: price(가격)는 0보다 큰 숫자여야 합니다.`);
  if (typeof m.distance !== "number" || m.distance < 0) errors.push(`${where}: distance(거리, 미터)는 숫자여야 합니다.`);
  if ("solo" in m && typeof m.solo !== "boolean") errors.push(`${where}: solo(혼밥 가능)는 true 또는 false여야 합니다.`);
  if ("delivery" in m && typeof m.delivery !== "boolean") errors.push(`${where}: delivery(배달 가능)는 true 또는 false여야 합니다.`);
});

const names = menus.map((m) => m.name);
names.forEach((n, i) => { if (names.indexOf(n) !== i) errors.push(`메뉴 이름이 겹칩니다: ${n}`); });

if (errors.length) {
  errors.forEach((e) => console.error("[실패] " + e));
  process.exit(1);
}
console.log(`[통과] 메뉴 ${menus.length}개를 검사했습니다. 문제가 없습니다.`);
