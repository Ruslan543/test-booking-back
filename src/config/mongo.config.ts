import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export async function getMongoDBConfig(
  configService: ConfigService,
): Promise<MongooseModuleOptions> {
  return {
    uri: configService.getOrThrow<string>("MONGO_URI"),
  };
}
