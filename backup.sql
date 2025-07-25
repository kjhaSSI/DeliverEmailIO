PGDMP      6                }            neondb    16.9    16.5 H    g           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            h           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            i           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            j           1262    16389    neondb    DATABASE     n   CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE neondb;
                neondb_owner    false            k           0    0    DATABASE neondb    ACL     0   GRANT ALL ON DATABASE neondb TO neon_superuser;
                   neondb_owner    false    3434            �            1259    16476 
   ai_queries    TABLE     �   CREATE TABLE public.ai_queries (
    id integer NOT NULL,
    user_id integer,
    query text NOT NULL,
    response text NOT NULL,
    rating integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.ai_queries;
       public         heap    neondb_owner    false            �            1259    16475    ai_queries_id_seq    SEQUENCE     �   CREATE SEQUENCE public.ai_queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.ai_queries_id_seq;
       public          neondb_owner    false    216            l           0    0    ai_queries_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.ai_queries_id_seq OWNED BY public.ai_queries.id;
          public          neondb_owner    false    215            �            1259    16486    api_keys    TABLE     O  CREATE TABLE public.api_keys (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    scopes json DEFAULT '[]'::json NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_used timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.api_keys;
       public         heap    neondb_owner    false            �            1259    16485    api_keys_id_seq    SEQUENCE     �   CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.api_keys_id_seq;
       public          neondb_owner    false    218            m           0    0    api_keys_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;
          public          neondb_owner    false    217            �            1259    16500 
   email_logs    TABLE     0  CREATE TABLE public.email_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "to" text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    status text NOT NULL,
    template_id integer,
    api_key_id integer,
    sent_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.email_logs;
       public         heap    neondb_owner    false            �            1259    16499    email_logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.email_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.email_logs_id_seq;
       public          neondb_owner    false    220            n           0    0    email_logs_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;
          public          neondb_owner    false    219            �            1259    16510    email_templates    TABLE     ]  CREATE TABLE public.email_templates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
 #   DROP TABLE public.email_templates;
       public         heap    neondb_owner    false            �            1259    16509    email_templates_id_seq    SEQUENCE     �   CREATE SEQUENCE public.email_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.email_templates_id_seq;
       public          neondb_owner    false    222            o           0    0    email_templates_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.email_templates_id_seq OWNED BY public.email_templates.id;
          public          neondb_owner    false    221            �            1259    16603    session    TABLE     �   CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
    DROP TABLE public.session;
       public         heap    neondb_owner    false            �            1259    16522    stripe_subscriptions    TABLE     �  CREATE TABLE public.stripe_subscriptions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    stripe_subscription_id text NOT NULL,
    status text NOT NULL,
    current_period_start timestamp without time zone NOT NULL,
    current_period_end timestamp without time zone NOT NULL,
    cancel_at_period_end boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
 (   DROP TABLE public.stripe_subscriptions;
       public         heap    neondb_owner    false            �            1259    16521    stripe_subscriptions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stripe_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.stripe_subscriptions_id_seq;
       public          neondb_owner    false    224            p           0    0    stripe_subscriptions_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.stripe_subscriptions_id_seq OWNED BY public.stripe_subscriptions.id;
          public          neondb_owner    false    223            �            1259    16536    system_logs    TABLE     �   CREATE TABLE public.system_logs (
    id integer NOT NULL,
    user_id integer,
    action text NOT NULL,
    endpoint text,
    details json,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.system_logs;
       public         heap    neondb_owner    false            �            1259    16535    system_logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.system_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.system_logs_id_seq;
       public          neondb_owner    false    226            q           0    0    system_logs_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.system_logs_id_seq OWNED BY public.system_logs.id;
          public          neondb_owner    false    225            �            1259    16546    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    full_name text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    plan text DEFAULT 'free'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap    neondb_owner    false            �            1259    16545    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          neondb_owner    false    228            r           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          neondb_owner    false    227            �           2604    16479    ai_queries id    DEFAULT     n   ALTER TABLE ONLY public.ai_queries ALTER COLUMN id SET DEFAULT nextval('public.ai_queries_id_seq'::regclass);
 <   ALTER TABLE public.ai_queries ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    216    215    216            �           2604    16489    api_keys id    DEFAULT     j   ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);
 :   ALTER TABLE public.api_keys ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    218    217    218            �           2604    16503    email_logs id    DEFAULT     n   ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);
 <   ALTER TABLE public.email_logs ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    220    219    220            �           2604    16513    email_templates id    DEFAULT     x   ALTER TABLE ONLY public.email_templates ALTER COLUMN id SET DEFAULT nextval('public.email_templates_id_seq'::regclass);
 A   ALTER TABLE public.email_templates ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    222    221    222            �           2604    16525    stripe_subscriptions id    DEFAULT     �   ALTER TABLE ONLY public.stripe_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.stripe_subscriptions_id_seq'::regclass);
 F   ALTER TABLE public.stripe_subscriptions ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    224    223    224            �           2604    16539    system_logs id    DEFAULT     p   ALTER TABLE ONLY public.system_logs ALTER COLUMN id SET DEFAULT nextval('public.system_logs_id_seq'::regclass);
 =   ALTER TABLE public.system_logs ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    225    226    226            �           2604    16549    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          neondb_owner    false    228    227    228            W          0    16476 
   ai_queries 
   TABLE DATA           V   COPY public.ai_queries (id, user_id, query, response, rating, created_at) FROM stdin;
    public          neondb_owner    false    216   �Z       Y          0    16486    api_keys 
   TABLE DATA           d   COPY public.api_keys (id, user_id, name, key, scopes, is_active, last_used, created_at) FROM stdin;
    public          neondb_owner    false    218   -\       [          0    16500 
   email_logs 
   TABLE DATA           p   COPY public.email_logs (id, user_id, "to", subject, body, status, template_id, api_key_id, sent_at) FROM stdin;
    public          neondb_owner    false    220   �\       ]          0    16510    email_templates 
   TABLE DATA           n   COPY public.email_templates (id, user_id, name, subject, body, is_active, created_at, updated_at) FROM stdin;
    public          neondb_owner    false    222   �\       d          0    16603    session 
   TABLE DATA           4   COPY public.session (sid, sess, expire) FROM stdin;
    public          neondb_owner    false    229   �\       _          0    16522    stripe_subscriptions 
   TABLE DATA           �   COPY public.stripe_subscriptions (id, user_id, stripe_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end, created_at, updated_at) FROM stdin;
    public          neondb_owner    false    224   �]       a          0    16536    system_logs 
   TABLE DATA           Y   COPY public.system_logs (id, user_id, action, endpoint, details, created_at) FROM stdin;
    public          neondb_owner    false    226   ^       c          0    16546    users 
   TABLE DATA           �   COPY public.users (id, username, email, password, full_name, role, stripe_customer_id, stripe_subscription_id, plan, is_active, created_at, updated_at) FROM stdin;
    public          neondb_owner    false    228   �^       s           0    0    ai_queries_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.ai_queries_id_seq', 2, true);
          public          neondb_owner    false    215            t           0    0    api_keys_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.api_keys_id_seq', 1, true);
          public          neondb_owner    false    217            u           0    0    email_logs_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.email_logs_id_seq', 1, false);
          public          neondb_owner    false    219            v           0    0    email_templates_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.email_templates_id_seq', 1, false);
          public          neondb_owner    false    221            w           0    0    stripe_subscriptions_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.stripe_subscriptions_id_seq', 1, true);
          public          neondb_owner    false    223            x           0    0    system_logs_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.system_logs_id_seq', 1, true);
          public          neondb_owner    false    225            y           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 3, true);
          public          neondb_owner    false    227            �           2606    16484    ai_queries ai_queries_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.ai_queries
    ADD CONSTRAINT ai_queries_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.ai_queries DROP CONSTRAINT ai_queries_pkey;
       public            neondb_owner    false    216            �           2606    16498    api_keys api_keys_key_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_key_unique UNIQUE (key);
 F   ALTER TABLE ONLY public.api_keys DROP CONSTRAINT api_keys_key_unique;
       public            neondb_owner    false    218            �           2606    16496    api_keys api_keys_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.api_keys DROP CONSTRAINT api_keys_pkey;
       public            neondb_owner    false    218            �           2606    16508    email_logs email_logs_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.email_logs DROP CONSTRAINT email_logs_pkey;
       public            neondb_owner    false    220            �           2606    16520 $   email_templates email_templates_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.email_templates DROP CONSTRAINT email_templates_pkey;
       public            neondb_owner    false    222            �           2606    16609    session session_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);
 >   ALTER TABLE ONLY public.session DROP CONSTRAINT session_pkey;
       public            neondb_owner    false    229            �           2606    16532 .   stripe_subscriptions stripe_subscriptions_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.stripe_subscriptions
    ADD CONSTRAINT stripe_subscriptions_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.stripe_subscriptions DROP CONSTRAINT stripe_subscriptions_pkey;
       public            neondb_owner    false    224            �           2606    16534 G   stripe_subscriptions stripe_subscriptions_stripe_subscription_id_unique 
   CONSTRAINT     �   ALTER TABLE ONLY public.stripe_subscriptions
    ADD CONSTRAINT stripe_subscriptions_stripe_subscription_id_unique UNIQUE (stripe_subscription_id);
 q   ALTER TABLE ONLY public.stripe_subscriptions DROP CONSTRAINT stripe_subscriptions_stripe_subscription_id_unique;
       public            neondb_owner    false    224            �           2606    16544    system_logs system_logs_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.system_logs DROP CONSTRAINT system_logs_pkey;
       public            neondb_owner    false    226            �           2606    16562    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public            neondb_owner    false    228            �           2606    16558    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            neondb_owner    false    228            �           2606    16560    users users_username_unique 
   CONSTRAINT     Z   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_unique;
       public            neondb_owner    false    228            �           1259    16610    IDX_session_expire    INDEX     J   CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);
 (   DROP INDEX public."IDX_session_expire";
       public            neondb_owner    false    229            �           2606    16563 )   ai_queries ai_queries_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.ai_queries
    ADD CONSTRAINT ai_queries_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 S   ALTER TABLE ONLY public.ai_queries DROP CONSTRAINT ai_queries_user_id_users_id_fk;
       public          neondb_owner    false    3257    228    216            �           2606    16568 %   api_keys api_keys_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 O   ALTER TABLE ONLY public.api_keys DROP CONSTRAINT api_keys_user_id_users_id_fk;
       public          neondb_owner    false    218    228    3257            �           2606    16583 /   email_logs email_logs_api_key_id_api_keys_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_api_key_id_api_keys_id_fk FOREIGN KEY (api_key_id) REFERENCES public.api_keys(id);
 Y   ALTER TABLE ONLY public.email_logs DROP CONSTRAINT email_logs_api_key_id_api_keys_id_fk;
       public          neondb_owner    false    220    218    3243            �           2606    16578 7   email_logs email_logs_template_id_email_templates_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_template_id_email_templates_id_fk FOREIGN KEY (template_id) REFERENCES public.email_templates(id);
 a   ALTER TABLE ONLY public.email_logs DROP CONSTRAINT email_logs_template_id_email_templates_id_fk;
       public          neondb_owner    false    220    222    3247            �           2606    16573 )   email_logs email_logs_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 S   ALTER TABLE ONLY public.email_logs DROP CONSTRAINT email_logs_user_id_users_id_fk;
       public          neondb_owner    false    228    3257    220            �           2606    16588 3   email_templates email_templates_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 ]   ALTER TABLE ONLY public.email_templates DROP CONSTRAINT email_templates_user_id_users_id_fk;
       public          neondb_owner    false    3257    222    228            �           2606    16593 =   stripe_subscriptions stripe_subscriptions_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.stripe_subscriptions
    ADD CONSTRAINT stripe_subscriptions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 g   ALTER TABLE ONLY public.stripe_subscriptions DROP CONSTRAINT stripe_subscriptions_user_id_users_id_fk;
       public          neondb_owner    false    228    3257    224            �           2606    16598 +   system_logs system_logs_user_id_users_id_fk    FK CONSTRAINT     �   ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);
 U   ALTER TABLE ONLY public.system_logs DROP CONSTRAINT system_logs_user_id_users_id_fk;
       public          neondb_owner    false    3257    226    228                       826    16392     DEFAULT PRIVILEGES FOR SEQUENCES    DEFAULT ACL     {   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;
          public          cloud_admin    false                       826    16391    DEFAULT PRIVILEGES FOR TABLES    DEFAULT ACL     x   ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;
          public          cloud_admin    false            W   j  x��QMK�@=7��b��6�^DP�����˺�6K7�qwbɿw�V�v>ޛy�6��>Nj�Cө�� �P.0�'��5y���;�5z�yP#�AEF����Q`�lȰ��v�G�H�Y-�-����~љ��H��~Ob/�V�M��kD������qצ��,yi�P�RKFhI�V��$v�3�^����][;����u|=�1����<�r1�/�<+�Y��t�*��I�c�a���| מh<v��!>�S!�8%�7�r}�b�N���X��8�Iz�c6��ѫ�轏�CzTR˟��7Ơ��e�/T���SՇ���8[���
�-q��{��m���/���"��/���,I�OgrҠ      Y   |   x��;�0 ��9Eս��|�� ,.@JbGBH�Ko�{�s���1\������"�I�T9���;�E�6�9�X��+Z(�b�=Q�;<�ݾ:>���'�	�@~��r��)��f��y�"      [      x������ � �      ]      x������ � �      d   �   x�E���0Fg��[( �p �x�b����P�E1�w�N��;�w��d�:��`���?'�H�ͥ|E��+�B�6�h����j�^&���
�P��M��ذ4�h�e��L�cǍ@���C+ϸ�
y�7Ǻ� ��A�&�sX�<+�ʂ��ڌRt�B_��2�      _   \   x�3�4�,.M���OΎ7�7475�04221724�LL.�,K�4202�50�50S04�26�21�3����[�����a�abdh`n�G�+F��� g�a      a   ^   x�3�4�L.JM,I�O,Ȍ�N����V2<S��u��sS���|+�2��K�S+�j9��Lu�u�������L��,-�,��b���� K*      c   �  x�Ւ��T1��;O�/�W��d�QmAG���v��.3�	ޞ;D�d����9���e���U���}�L�Vٰ�RC��!̅!ETwl�&�{Q���ٙ;*"�d.H�V;���W)�Cpt2P�-��(F�V91�����D�V����kO�������)�?K<������L�	�}��T�2n�l��5,П�M�z,���x�F�Ѹ\�/��e�s�5�@���b�7��?C�-�-�L,��N�U��E������<�� ������Q�z�t�����7,Fe�h}%'��yh��8�%_!w�y�d�
� �s��@�C�b��������/Iz#M����ͼ+q/�iz�oz��F��}�1�kYآ�-5I�k�4o6�����     