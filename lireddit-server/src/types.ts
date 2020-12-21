import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type LiredditDbContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
