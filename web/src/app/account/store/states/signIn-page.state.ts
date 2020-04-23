import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SignInPageActions } from '../actions/signIn-page.action';
import SignIn = SignInPageActions.SignIn;
import { catchError, map } from 'rxjs/operators';
import { AuthActions } from '../actions/auth.action';
import SignInSuccess = AuthActions.SignInSuccess;
import SignInFailed = AuthActions.SignInFailed;
import { of } from 'rxjs';
import { criticalError, invalidCredentials } from '../errors/signIn-page.errors';
import { HttpErrorResponse } from '@angular/common/http';


export interface ISignInPageState {
  pending: boolean,
  error: string | null,
}

export const initialSignInPageState: ISignInPageState = {
  pending: false,
  error: null,
};

export const SIGNINPAGE_STATE_TOKEN = new StateToken<ISignInPageState>("signInPage");

@State({
  name: SIGNINPAGE_STATE_TOKEN,
  defaults: initialSignInPageState,
})
@Injectable()
export class SignInPageState {

  @Selector()
  static getSignInError(state: ISignInPageState) {
    return state.error;
  }



  constructor(
    private readonly _authService: AuthService,
  ) {
  }

  @Action(SignIn)
  signIn(ctx: StateContext<ISignInPageState>, action: SignIn) {
    ctx.patchState({
      pending: true,
    });
    return this._authService.signIn(action.signInDto).pipe(
      map(data => {
        if (data.error !== "") {
          return ctx.dispatch(new SignInFailed(invalidCredentials));
        }
        return ctx.dispatch(new SignInSuccess());
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse){
          if(err.status === 401)
            return ctx.dispatch(new SignInFailed(invalidCredentials));
        }
        return ctx.dispatch(new SignInFailed(criticalError));
      })
    );
  }

  @Action(SignInFailed)
  signInFailed(ctx: StateContext<ISignInPageState>, action: SignInFailed) {
    return ctx.patchState({
      pending: false,
      error: action.error,
    });
  }

}