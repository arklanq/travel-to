import DirectAPI from '@client/mechanisms/DirectAPI';
import IJourneyResource from '@server/interfaces/resources/IJourneyResource';
import axios, {AxiosResponse} from 'axios';
import {useEffect, useMemo, useState} from 'react';

interface ILocalState {
  status: 'loading' | 'success' | 'error';
  journeys: Omit<IJourneyResource, 'images'>[];
  error?: unknown;
}
type ReturnType =
  | [loading: true, error: undefined, data: undefined]
  | [loading: false, error: unknown, data: undefined]
  | [loading: false, error: undefined, data: ILocalState['journeys']];

export default function useFetchJourneys(): ReturnType {
  const [state, setState] = useState<ILocalState>({
    status: 'loading',
    journeys: [],
    error: undefined,
  });

  useEffect(() => {
    const request = axios.CancelToken.source();

    if (state.status === 'loading' && state.journeys.length === 0) {
      DirectAPI.get<ILocalState['journeys']>('/journeys', {cancelToken: request.token})
        .then((response: AxiosResponse<ILocalState['journeys']>) => {
          setState({
            ...state,
            status: 'success',
            journeys: response.data,
            error: undefined,
          });
        })
        .catch((e: unknown) => {
          if (axios.isCancel(e)) return;

          setState({
            ...state,
            status: 'error',
            journeys: [],
            error: e,
          });
        });
    }

    return () => {
      request && request.cancel('USE_EFFECT_CLEANUP');
    };
  }, [state, setState]);

  return useMemo(() => {
    return [
      state.status === 'loading',
      state.status === 'error' ? state.error : undefined,
      state.journeys,
    ] as ReturnType;
  }, [state]);
}
