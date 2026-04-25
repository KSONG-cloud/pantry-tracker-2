create table public.account (
  id serial not null,
  username text not null,
  password_hash text not null,
  email text not null,
  updated_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint account_pkey primary key (id),
  constraint email unique (email),
  constraint username unique (username)
) TABLESPACE pg_default;

create trigger update_account_updated_at BEFORE
update OF username,
password_hash,
email on account for EACH row
execute FUNCTION update_updated_at ();

create table public.food (
  id serial not null,
  food_name text not null,
  constraint food_pkey primary key (id)
) TABLESPACE pg_default;

create table public.foodgroup (
  id serial not null,
  user_id integer not null,
  name text not null default 'Untitled'::text,
  display_order integer not null,
  is_system boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint foodgroup_pkey primary key (id),
  constraint user_id_and_display_order unique (user_id, display_order) deferrable,
  constraint foodgroup_user_id foreign KEY (user_id) references account (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger update_foodgroups_updated_at BEFORE
update OF name,
display_order on foodgroup for EACH row
execute FUNCTION update_updated_at ();

create table public.icons (
  id serial not null,
  name text not null,
  type public.icon_type not null,
  url text not null,
  tags text[] null,
  uploaded_by integer null,
  created_at timestamp with time zone not null default now(),
  constraint icons_pkey primary key (id),
  constraint uploaded_by_userid foreign KEY (uploaded_by) references account (id)
) TABLESPACE pg_default;

create table public.pantry (
  id serial not null,
  food_id integer not null,
  expiry_date date null,
  bestbefore_date date null,
  added_date date not null,
  quantity numeric not null,
  units text null,
  foodgroup_id integer not null,
  removed boolean not null default false,
  user_id integer not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint pantry_pkey primary key (id),
  constraint fk_pantry_food_id foreign KEY (food_id) references food (id),
  constraint fk_pantry_foodgroup_id foreign KEY (foodgroup_id) references foodgroup (id),
  constraint fk_pantry_user_id foreign KEY (user_id) references account (id)
) TABLESPACE pg_default;

create trigger update_pantry_updated_at BEFORE
update OF expiry_date,
bestbefore_date,
added_date,
quantity,
units,
foodgroup_id,
removed,
user_id on pantry for EACH row
execute FUNCTION update_updated_at ();

create table public.refreshtokens (
  id serial not null,
  user_id integer not null,
  token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone not null default now(),
  constraint refreshtokens_pkey primary key (id),
  constraint user_id foreign KEY (user_id) references account (id) on delete CASCADE
) TABLESPACE pg_default;