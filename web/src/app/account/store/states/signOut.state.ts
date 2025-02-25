import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { AuthActions } from '../actions/auth.action';
import { MatDialog } from '@angular/material/dialog';
import { SignoutDialogComponent } from '../../dialogs/signout/signout.dialog.component';
import { AuthService } from '../../services/auth.service';
import SignOutSuccess = AuthActions.SignOutSuccess;
import SignOutFailed = AuthActions.SignOutFailed;
import { SignOutActions } from '../actions/signOut.action';
import SignOutConfirmed = SignOutActions.SignOutConfirmed;
import SignOutDeclined = SignOutActions.SignOutDeclined;
import SignOut = SignOutActions.SignOut;

export interface ISignOutState {
  pending: boolean;
  errors?: any;
}

export const initialSignOutState: ISignOutState = {
  pending: false,
  errors: null,
};

/**
 * The state of the sign out process. Determines if any errors are present.
 * This state dispatches new Actions which change mainly the Auth-status State.
 * There is no sign out component.
 * A dialog box is instead launched when the user request a sign out.
 */
@State({
  name: "signOut",
  defaults: initialSignOutState,
})
@Injectable()
export class SignOutState {

  constructor(
    private readonly _dialogService: MatDialog,
    private readonly _authService: AuthService,
  ) {
  }

  /**
   * Starts the sign out process.
   * @param ctx The current state
   * @param action The action with is processed.
   */
  @Action(SignOut)
  async signOut(ctx: StateContext<ISignOutState>, action: SignOut){
    ctx.patchState({
      pending: true,
    });

    const confirmed = await this._dialogService.open(SignoutDialogComponent).afterClosed().toPromise();

    console.log("Resulting: " + confirmed);

    if(confirmed)
      return ctx.dispatch(new SignOutConfirmed());
    return ctx.dispatch(new SignOutDeclined());
  }

  /**
   * The sign out process was successful
   * @param ctx The current state
   * @param action The action which is processed
   */
  @Action(SignOutConfirmed)
  async signOutConfirmed(ctx: StateContext<ISignOutState>, action: SignOutConfirmed){
    try {
      await this._authService.signOut();
      ctx.dispatch(new SignOutSuccess());
    }
    catch (e) {
      ctx.dispatch(new SignOutFailed(e));
    }
  }

  /**
   * The sign out process failed
   * @param ctx The current state
   * @param action The action which is processed. It contains information about the error
   */
  @Action(SignOutFailed)
  signOutFailed(ctx: StateContext<ISignOutState>, action: SignOutFailed){
    console.log("Sign out Failed with error: " + action.error);
    ctx.patchState({
      pending: false,
      errors: action.error,
    });
  }
}

/*

*/
