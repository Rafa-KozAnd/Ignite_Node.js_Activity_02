import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Create Category Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `insert into users (
                id, 
                name, 
                email, 
                password, 
                "is_admin", 
                created_at,
                driver_license) 
            values('${id}',
                 'admin',
                 'admin@rentx.com',
                  '${password}',
                  true,
                  'now()',
                  'XXXXXX')`
        );
    });
    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });
    it("Should be able to create a new category ", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });
        const { refresh_token } = responseToken.body;

        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest",
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });
        expect(response.status).toBe(201);
    });
    it("Should not be able to create a new category with a existing name", async () => {
        const responseToken = await request(app).post("/sessions").send({
            email: "admin@rentx.com",
            password: "admin",
        });
        const { refresh_token } = responseToken.body;

        const response = await request(app)
            .post("/categories")
            .send({
                name: "Category Supertest",
                description: "Category Supertest",
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });
        expect(response.status).toBe(400);
    });
});
