import { Injectable } from '@angular/core';
import {Opshtina} from './opshtina';
import {OPSHTINI} from './opshtini';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  private opstini: Opshtina[] = OPSHTINI;
  private graph: Record<string, Opshtina> = {};
  constructor() {
    this.initializeGraph(this.opstini);
  }

  private initializeGraph(data: Opshtina[]) {
    data.forEach((municipality) => {
      this.graph[municipality.id] = municipality;
    });
  }

  public getGraph() {
    return this.graph;
  }

  getNeighbors(municipalityId: string): Opshtina[] {
    const municipality = this.graph[municipalityId];
    if (!municipality) return [];
    return municipality.borders.map(borderId => this.graph[borderId]);
  }

  findShortestPath(start: string, end: string): string[] | null {
    if (!this.graph[start] || !this.graph[end]) {
      throw new Error('Invalid municipality ID(s)');
    }

    const queue: { path: string[]; current: string }[] = [{ path: [start], current: start }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { path, current } = queue.shift()!;
      if (current === end) {
        return path;
      }

      visited.add(current);

      this.graph[current].borders.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          queue.push({ path: [...path, neighbor], current: neighbor });
        }
      });
    }

    return null; // No path found
  }
}
