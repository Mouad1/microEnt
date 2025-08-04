// UI Components Library
export * from './components/button.component';
export * from './components/card.component';
export * from './components/input.component';
export * from './components/badge.component';
export * from './components/modal.component';
export * from './components/loading.component';

// UI Library Module for easy import
import { ButtonComponent } from './components/button.component';
import { CardComponent } from './components/card.component';
import { InputComponent } from './components/input.component';
import { BadgeComponent } from './components/badge.component';
import { ModalComponent } from './components/modal.component';
import { LoadingComponent } from './components/loading.component';

export const UI_COMPONENTS = [
  ButtonComponent,
  CardComponent,
  InputComponent,
  BadgeComponent,
  ModalComponent,
  LoadingComponent,
] as const;
