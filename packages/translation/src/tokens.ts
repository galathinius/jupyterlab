/* ----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import type { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { ServerConnection } from '@jupyterlab/services';
import { DataConnector, IDataConnector } from '@jupyterlab/statedb';
import { Token } from '@lumino/coreutils';
import { requestTranslationsAPI } from './server';

/*
 * Translation
 */
type Language = { [key: string]: string };

export interface ITranslatorConnector
  extends IDataConnector<Language, Language, { language: string }> {}

export const ITranslatorConnector = new Token<ITranslatorConnector>(
  '@jupyterlab/translation:ITranslatorConnector'
);

export class TranslatorConnector
  extends DataConnector<Language, Language, { language: string }>
  implements ITranslatorConnector {
  constructor(
    translationsUrl: string = '',
    serverSettings?: ServerConnection.ISettings
  ) {
    super();
    this._translationsUrl = translationsUrl;
    this._serverSettings = serverSettings;
  }

  async fetch(opts: { language: string }): Promise<Language> {
    return requestTranslationsAPI(
      this._translationsUrl,
      opts.language,
      {},
      this._serverSettings
    );
  }

  private _serverSettings: ServerConnection.ISettings | undefined;
  private _translationsUrl: string;
}

/**
 * Bundle of gettext-based translation functions for a specific domain.
 */
export type TranslationBundle = IRenderMime.TranslationBundle;

/**
 * Translation provider interface
 */
export interface ITranslator extends IRenderMime.ITranslator {}

export const ITranslator = new Token<ITranslator>(
  '@jupyterlab/translation:ITranslator'
);
