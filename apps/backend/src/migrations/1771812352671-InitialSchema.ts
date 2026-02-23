import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1771812352671 implements MigrationInterface {
    name = 'InitialSchema1771812352671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL, "name" character varying NOT NULL, "share_code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_181c724670cdcb47628f1b19061" UNIQUE ("share_code"), CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "players" ("id" uuid NOT NULL, "name" character varying NOT NULL, "score" integer NOT NULL DEFAULT '0', "room_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de22b8fdeee0c33ab55ae71da3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "score_history" ("id" uuid NOT NULL, "player_id" uuid NOT NULL, "previous_score" integer NOT NULL, "new_score" integer NOT NULL, "change_amount" integer NOT NULL, "change_type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4db9bfe50f50c7737fc04c2fb2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "players" ADD CONSTRAINT "FK_42530bbf46c4b64a5921dbc2047" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "score_history" ADD CONSTRAINT "FK_3cf88130594c57ea83da6725e1c" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "score_history" DROP CONSTRAINT "FK_3cf88130594c57ea83da6725e1c"`);
        await queryRunner.query(`ALTER TABLE "players" DROP CONSTRAINT "FK_42530bbf46c4b64a5921dbc2047"`);
        await queryRunner.query(`DROP TABLE "score_history"`);
        await queryRunner.query(`DROP TABLE "players"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
