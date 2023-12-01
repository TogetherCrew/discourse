import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProxyService {
  uri: string;

  constructor(private readonly configService: ConfigService) {
    this.uri = configService.get<string>('PROXY_URI');
  }

  getProxy(): HttpsProxyAgent<string> {
    const port = this.getRandomNumber(20001, 29980);
    const url = `${this.uri}:${port}`;
    return new HttpsProxyAgent(url);
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
