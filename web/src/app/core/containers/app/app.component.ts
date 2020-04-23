import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SidenavActions, SidenavState, ThemeActions } from '../../store';
import { Observable } from 'rxjs';
import CloseSidenav = SidenavActions.CloseSidenav;
import OpenSidenav = SidenavActions.OpenSidenav;
import SetTheme = ThemeActions.SetTheme;
import { Themes } from '../../services/theme.service';
import { AuthActions } from '../../../account/store/actions/auth.action';
import { UserActions } from '../../../account/store/actions/user.action';
import GetUser = UserActions.GetUser;
import { SelectControlValueAccessor } from '@angular/forms';
import { AuthStatusState } from '../../../account/store/states/auth-status.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {



  @Select(AuthStatusState.getSignedIn)
  isSignedIn$: Observable<boolean>;

  constructor(
    private readonly _store: Store,
  ) { }

  ngOnInit(): void {
    this._store.dispatch(new SetTheme(Themes.light));
    this._store.dispatch(new GetUser());
  }



  closeSidenav(){this._store.dispatch(new CloseSidenav());}
  openSidenav(){this._store.dispatch(new OpenSidenav());}
}