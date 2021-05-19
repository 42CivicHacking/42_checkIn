export class ClusterDTO {
  constructor(
    gaepo: number,
    seocho: number,
    gaepoWaiting: number,
    seochoWaiting: number,
  ) {
    this.gaepo = gaepo;
    this.seocho = seocho;
    this.gaepoWaiting = gaepoWaiting;
    this.seochoWaiting = seochoWaiting;
  }
  private gaepo: number;
  private seocho: number;
  private gaepoWaiting: number;
  private seochoWaiting: number;
}
