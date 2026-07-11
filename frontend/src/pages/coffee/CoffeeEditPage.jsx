import PageShell from "../../components/common/PageShell.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import { coffeeLogs } from "../../data/sampleData.js";

export default function CoffeeEditPage() {
  const coffee = coffeeLogs[0];

  return (
    <PageShell title="커피 기록 수정" eyebrow="Edit coffee" subtitle="원두 정보와 맛 평가를 다듬어 페어링 정확도를 높입니다.">
      <section className="panel compose-panel">
        <div className="form-grid">
          <Input defaultValue={coffee.bean} />
          <Input defaultValue={coffee.roastery} />
          <Input defaultValue={coffee.brew} />
          <Input defaultValue={coffee.roast} />
        </div>
        <textarea className="textarea" defaultValue={coffee.memo} />
        <Button>수정 저장</Button>
      </section>
    </PageShell>
  );
}
