import { Test, TestingModule } from '@nestjs/testing';
import { DbModule, DB } from '../db.module';

describe('DbModule 연결 테스트', () => {
  let module: TestingModule;
  let db: DB;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [DbModule],
    }).compile();

    // 'DATABASE' 토큰으로 등록된 인스턴스를 가져옵니다.
    db = module.get<DB>('DATABASE');
  });

  it('DATABASE 인스턴스가 정의되어 있어야 한다', () => {
    expect(db).toBeDefined();
  });

  it('DB에 연결되어 기본적인 쿼리가 실행되어야 한다', async () => {
    // 실제로 DB에 간단한 쿼리를 날려 연결을 확인합니다 (1을 반환하는 쿼리)
    const result = await db.execute('SELECT 1 as check');
    expect(result.rows[0].check).toBe(1);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });
});
