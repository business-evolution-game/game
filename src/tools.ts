export function createPosition(step: number, branch: number = 0): number {
    return (branch << 6) | step;
}