import {IProcessDefEntity} from '@process-engine-js/process_engine_contracts';
import {bindable, computedFrom, inject} from 'aurelia-framework';
import {IChooseDialogOption, IProcessEngineService} from '../../contracts';
import environment from '../../environment';
import {BpmnIo} from '../bpmn-io/bpmn-io';

interface RouteParameters {
  processId: string;
}

@inject('ProcessEngineService')
export class Processdetail {
  private processEngineService: IProcessEngineService;
  private _process: IProcessDefEntity;
  private bpmn: BpmnIo;
  @bindable() public uri: string;
  @bindable() public name: string;

  constructor(processEngineService: IProcessEngineService) {
    this.processEngineService = processEngineService;
  }

  public activate(routeParameters: RouteParameters): void {
    this.processEngineService.getProcessbyID(routeParameters.processId)
      .then((result: IProcessDefEntity) => {
        this._process = result;
      });
  }

  @computedFrom('_process')
  public get process(): IProcessDefEntity {
    return this._process;
  }

  public onModdlelImported(moddle: any, xml: string): void {
    this.bpmn.xml = xml;
  }

  public saveDiagram(): void {
    this.bpmn.getXML().then((xml: string) => {
      return this.processEngineService.updateProcessDef(this.process, xml);
    }).then((response: any) => {
      if (response.error) {
        alert(`Fehler: ${response.error}`);
      } else if (response.result) {
        alert('Gespeichert.');
      } else {
        alert(`Unbekannter Status: ${JSON.stringify(response)}`);
      }
    });
  }

  public exportDiagram(): void {
    document.getElementById('idexport').setAttribute('disabled', 'true');
    document.getElementById('spinner').setAttribute('style', 'display: run-in;');
    this.bpmn.getXML().then((xml: any) => {
      this.uri = 'data:application/bpmn20-xml;charset=UTF-8,' + encodeURI(xml);
      this.name = 'Diagram.xml';
      const atag: HTMLAnchorElement = document.createElement('a');
      atag.setAttribute('href', this.uri);
      atag.setAttribute('id', 'exportxml');
      atag.setAttribute('download', this.name);
      atag.setAttribute('hidden', 'true');
      document.body.appendChild(atag);
      document.getElementById('exportxml').click();
      const del: HTMLElement = document.getElementById('exportxml');
      del.parentNode.removeChild(del);
      document.getElementById('idexport').removeAttribute('disabled');
      document.getElementById('spinner').setAttribute('style', 'display: none;');
    });
  }

}