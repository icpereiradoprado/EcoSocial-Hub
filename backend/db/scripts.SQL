--SCRIPT DE CRIAÇÃO DO BANCO v1.0

-- [DATABASE]

CREATE DATABASE ECOSOCIALHUB;

-- EXTENSÃO PARA REMOÇÃO DOS ACENTOS
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ===========================================================================
-- [USER_ACCOUNT]
-- ID                   | ID DO USUÁRIO
-- NAME                 | NOME DO USUÁRIO
-- EMAIL                | EMAIL DO USUÁRIO
-- PASSWORD             | SENHA DO USUÁRIO
-- IS_ADMIN             | ADMIN? [0]:NÃO [1]:SIM
-- PHONE_NUMBER         | NÚMERO DE TELEFONE DO USUÁRIO
-- PROFILE_PICTURE      | FOTO DE PERFIL
-- PROFILE_PICTURE_EXT  | EXTENSÃO DA FOTO DE PPERFIL
-- CITY                 | CIDADE
-- ===========================================================================
CREATE TABLE USER_ACCOUNT
(
	ID                   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  , NAME                 VARCHAR(255)                            NOT NULL
  , EMAIL                VARCHAR(255) 						                   NULL
  , PASSWORD             VARCHAR(255)				                     NOT NULL
  , IS_ADMIN             NUMERIC(1)				   DEFAULT 0           NOT NULL
  , PHONE_NUMBER         VARCHAR(15)                                 NULL
  , PROFILE_PICTURE      BYTEA                                       NULL
  , PROFILE_PICTURE_EXT  VARCHAR(10)                                 NULL
  , CITY                 VARCHAR(255)                            NOT NULL
);

-- ===========================================================================
-- [POST]
-- ID                   | ID DO POST
-- TITLE                | TITULO DO POST
-- CONTENT              | CONTEÚDO DO COMENTÁRIO
-- USER_ID              | ID DO USUÁRIO QUE CRIOU O POST
-- INACTIVE             | STATUS DO POST [0]:ATIVO [1]:INATIVO
-- UPVOTES              | VOTOS POSITIVOS
-- DOWNVOTES            | VOTOS NEGATIVOS
-- SCORE                | SCORE DO POST
-- COMMENT_COUNT        | NÚMERO DE COMENTÁRIOS
-- LAST_ACTIVITY_AT     | DATA DA ÚLTIMA ATIVIDADE NO POST (UPVOTES, DOWNVOTES, COMMENT)
-- CREATE_DATE          | DATA DE CRIAÇÃO DO POST
-- UPDATE_DATE          | DATA DE ATUALIZAÇÃO DO POST
-- POST_PICTURE         | FOTO DE PERFIL
-- POST_PICTURE_EXT     | EXTENSÃO DA FOTO DE PPERFIL
-- ===========================================================================
CREATE TABLE POST
(
	ID                   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  , TITLE                VARCHAR(255)                               NOT NULL
  , CONTENT              TEXT                   				            NOT NULL
  , USER_ID              INTEGER REFERENCES USER_ACCOUNT(ID) ON DELETE CASCADE  NOT NULL
  , INACTIVE             NUMERIC(1)			       DEFAULT 0     NOT NULL
  , UPVOTES              INTEGER                      DEFAULT 0         NULL             
  , DOWNVOTES            INTEGER                      DEFAULT 0         NULL
  , SCORE                INTEGER GENERATED ALWAYS AS (((UPVOTES - DOWNVOTES) / (CASE WHEN (UPDATE_DATE::DATE - CREATE_DATE::DATE) = 0 THEN 1 ELSE (UPDATE_DATE::DATE - CREATE_DATE::DATE) END))) STORED
  , COMMENT_COUNT        INTEGER                      DEFAULT 0     NOT NULL
  , LAST_ACTIVITY_AT     TIMESTAMP(3)                 DEFAULT NOW() NOT NULL
  , CREATE_DATE          TIMESTAMP(3)                 DEFAULT NOW() NOT NULL
  , UPDATE_DATE          TIMESTAMP(3)                                   NULL
  , POST_PICTURE         BYTEA                                          NULL
  , POST_PICTURE_EXT     VARCHAR(10)                                    NULL
);

-- ===========================================================================
-- [COMMENT]
-- ID                   | ID DO COMENTÁRIO
-- POST_ID              | ID DO POST
-- USER_ID              | ID DO USUÁRIO
-- CONTENT              | CONTEÚDO DO COMENTÁRIO
-- COMMENT_PARENT       | ID DO COMETÁRIO PAI  
-- CREATE_DATE          | DATA DE CRIAÇÃO DO COMENTÁRIO
-- UPDATE_DATE          | DATA DE ATUALIZAÇÃO DO COMENTÁRIO
-- ===========================================================================
CREATE TABLE COMMENT
(
	ID                   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  , POST_ID              INTEGER REFERENCES POST(ID)             ON DELETE CASCADE  NOT NULL
  , USER_ID              INTEGER REFERENCES USER_ACCOUNT(ID)     ON DELETE CASCADE  NOT NULL
  , CONTENT              VARCHAR(255)                                               NOT NULL
  , COMMENT_PARENT       INTEGER                                                        NULL
  , CREATE_DATE          TIMESTAMP(3)              DEFAULT NOW()                    NOT NULL
  , UPDATE_DATE          TIMESTAMP(3)                                                   NULL
);

-- ===========================================================================
-- [EDUCATIONAL_CONTENT]
-- ID                   | ID DO CONTEÚDO EDUCACIONAL
-- TITLE                | TITULO
-- CONTENT              | CONTEUDO
-- CREATE_DATE          | DATA DE CRIAÇÃO DO CONTEUDO EDUCACIONAL
-- UPDATE_DATE          | DATA DE ATUALIZAÇÃO
-- USER_ID              | ID DO USUÁRIO CRIADOR
-- TAG                  | TAGS      
-- CONTENT_PICTURE      | FOTO DE PERFIL
-- CONTENT_PICTURE_EXT  | EXTENSÃO DA FOTO DE PPERFIL
-- ===========================================================================
CREATE TABLE EDUCATIONAL_CONTENT
(
	ID                   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  , TITLE                VARCHAR(255)                            NOT NULL
  , CONTENT              VARCHAR(900)                            NOT NULL
  , CREATE_DATE          TIMESTAMP(3)              DEFAULT NOW()     NULL
  , UPDATE_DATE          TIMESTAMP(3)                                NULL
  , USER_ID              INTEGER REFERENCES USER_ACCOUNT(ID)     NOT NULL
  , TAG                  TEXT                                        NULL
  , CONTENT_PICTURE      BYTEA                                       NULL
  , CONTENT_PICTURE_EXT  VARCHAR(10)                                 NULL
);

-- ===========================================================================
-- [RECYCLING_CENTER]
-- ID                   | ID DO CENTRO DE RECICLAGEM
-- NAME                 | NOME DO CENTRO DE RECICLAGEM
-- STREET               | RUA
-- NUMBER               | NÚMERO     
-- COMPLEMENT           | COMPLEMENTO
-- POSTAL_CODE          | CEP 
-- STATE                | ESTADO
-- CITY                 | CIDADE
-- OPENING_HOUR         | HORÁRIO DE FUNCIONAMENTO
-- PHONE_NUMBER         | NÚMERO DE TELEFONE
-- CREATE_DATE          | DATA DE CRIAÇÃO DO RECYCLING CENTER
-- UPDATE_DATE          | DATA DE ATUALIZAÇÃO
-- ===========================================================================
CREATE TABLE RECYCLING_CENTER
(
	ID                   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  , NAME                 VARCHAR(255)                            NOT NULL
  , STREET               VARCHAR(255)                            NOT NULL
  , NUMBER               VARCHAR(10)                                 NULL
  , COMPLEMENT           VARCHAR(255)                                NULL
  , POSTAL_CODE          CHAR(9)                                     NULL
  , STATE                CHAR(2)                                 NOT NULL
  , CITY                 VARCHAR(50)                             NOT NULL
  , OPENING_HOUR         VARCHAR(50)                             NOT NULL
  , PHONE_NUMBER         VARCHAR(20)                                 NULL
  , CREATE_DATE          TIMESTAMP(3)              DEFAULT NOW() NOT NULL
  , UPDATE_DATE          TIMESTAMP(3)                                NULL
  , UNIQUE(NAME)
);

-- ===========================================================================
-- [RECYCLING_CENTER]
-- ID                   | ID
-- POST_ID              | ID DO POST
-- USER_ID              | ID DO USER
-- TYPE                 | [1]:UPVOTE [2]:DOWNVOTE     
-- ===========================================================================
CREATE TABLE VOTE
(
    ID                     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY 
  , POST_ID                INTEGER REFERENCES POST(ID)          ON DELETE CASCADE NOT NULL
  , USER_ID                INTEGER REFERENCES USER_ACCOUNT(ID)  ON DELETE CASCADE NOT NULL
  , TYPE                   INTEGER                                 NOT NULL
);

-- [SCRIPT DE UPDATE DO BANCO]

--ALTER TABLE POST DROP COLUMN SCORE; ALTER TABLE POST ADD COLUMN SCORE INTEGER GENERATED ALWAYS AS (((UPVOTES - DOWNVOTES) / (CASE WHEN (UPDATE_DATE::DATE - CREATE_DATE::DATE) = 0 THEN 1 ELSE (UPDATE_DATE::DATE - CREATE_DATE::DATE) END))) STORED;
--ALTER TABLE USER_ACCOUNT ADD COLUMN PROFILE_PICTURE BYTEA NULL;
--ALTER TABLE USER_ACCOUNT ADD COLUMN CITY VARCHAR(255) NULL;
--ALTER TABLE USER_ACCOUNT ADD COLUMN PROFILE_PICTURE_EXT VARCHAR(10) NULL;
--ALTER TABLE POST ADD COLUMN POST_PICTURE BYTEA NULL;
--ALTER TABLE POST ADD COLUMN POST_PICTURE_EXT VARCHAR(10) NULL;
--ALTER TABLE EDUCATION_CONTENT ADD COLUMN CONTENT_PICTURE VARCHAR(10) NULL;
--ALTER TABLE EDUCATION_CONTENT ADD COLUMN CONTENT_PICTURE_EXT VARCHAR(10) NULL;
--ALTER TABLE RECYCLING_CENTER  ADD COLUMN CREATE_DATE TIMESTAMP(3) DEFAULT NOW() NOT NULL;
--ALTER TABLE RECYCLING_CENTER  ADD COLUMN UPDATE_DATE TIMESTAMP(3) NULL;
--ALTER TABLE EDUCATIONAL_CONTENT ALTER COLUMN CREATE_DATE SET DEFAULT NOW();
--ALTER TABLE EDUCATIONAL_CONTENT ALTER COLUMN CREATE_DATE SET NOT NULL;
--ALTER TABLE POST ALTER COLUMN UPDATE_DATE DROP DEFAULT;
--ALTER TABLE POST ALTER COLUMN UPDATE_DATE SET NULL;
--ALTER TABLE COMMENT ALTER COLUMN CREATE_DATE SET DEFAULT NOW();
--ALTER TABLE COMMENT ALTER COLUMN CREATE_DATE SET NOT NULL;
--ALTER TABLE RECYCLING_CENTER ALTER COLUMN CREATE_DATE SET DEFAULT NOW();
--ALTER TABLE RECYCLING_CENTER ALTER COLUMN CREATE_DATE SET NOT NULL;

-- [TRIGGERS]

-- ===========================================================================
-- [TR_VOTE]
-- ===========================================================================
CREATE OR REPLACE FUNCTION TR_VOTE() RETURNS TRIGGER AS $$
DECLARE
  V_ACTION INTEGER := (CASE TG_OP WHEN 'INSERT' THEN 1 WHEN 'DELETE' THEN 2 WHEN 'UPDATE' THEN 3 ELSE 0 END);
BEGIN
  -- INSERT
  IF V_ACTION = 1 THEN
    IF NEW.TYPE = 1 THEN
	  -- ATUALIZA A TABELA POST SOMANDO MAIS UM AOS UPVOTES
      UPDATE POST SET UPVOTES = (UPVOTES + 1) WHERE ID = NEW.POST_ID;
    ELSIF NEW.TYPE = 2 THEN
	  -- ATUALIZA A TABELA POST SOMANDO MAIS UM AOS DOWNVOTES
      UPDATE POST SET DOWNVOTES = (DOWNVOTES + 1) WHERE ID = NEW.POST_ID;
    END IF;
  -- DELETE
  ELSIF V_ACTION = 2 THEN
    IF OLD.TYPE = 1 THEN
	  -- REMOVE UM UPVOTE DA TABELA POST
      UPDATE POST SET UPVOTES = (UPVOTES - 1) WHERE ID = OLD.POST_ID;
    ELSIF OLD.TYPE = 2 THEN
	  -- REMOVE UM DOWNVOTE DA TABELA POST
      UPDATE POST SET DOWNVOTES = (DOWNVOTES - 1) WHERE ID = OLD.POST_ID;
    END IF;
  -- UPDATE
  ELSIF V_ACTION = 3 THEN
    IF NEW.TYPE = 1 THEN
	  -- ATUALIZA A TABELA POST TIRANDO UM DOWNVOTE E ACRESENTANDO UM UPVOTE
   	  UPDATE POST SET DOWNVOTES = (DOWNVOTES - 1) WHERE ID = NEW.POST_ID;
      UPDATE POST SET UPVOTES = (UPVOTES + 1) WHERE ID = NEW.POST_ID;
    ELSIF NEW.TYPE = 2 THEN
	  -- ATUALIZA A TABELA POST TIRANDO UM UPVOTE E ACRESENTANDO UM DOWNVOTE
      UPDATE POST SET UPVOTES = (UPVOTES - 1) WHERE ID = NEW.POST_ID;
      UPDATE POST SET DOWNVOTES = (DOWNVOTES + 1) WHERE ID = NEW.POST_ID;
    END IF;
  END IF;
  IF V_ACTION IN (1,3) THEN RETURN NEW; ELSE RETURN OLD; END IF;
END; $$ LANGUAGE PLPGSQL
;
CREATE OR REPLACE TRIGGER TR_VOTE_ARIDU AFTER INSERT OR DELETE OR UPDATE ON VOTE FOR EACH ROW EXECUTE FUNCTION TR_VOTE()
;

-- ===========================================================================
-- [TR_COMMENT]
-- ===========================================================================
CREATE OR REPLACE FUNCTION TR_COMMENT() RETURNS TRIGGER AS $$
DECLARE
  V_ACTION INTEGER := (CASE TG_OP WHEN 'INSERT' THEN 1 WHEN 'DELETE' THEN 2 WHEN 'UPDATE' THEN 3 ELSE 0 END);
BEGIN
  -- INSERT
  IF V_ACTION = 1 THEN
    -- SE ESTIVER INSERINDO ATUALIZA A COLUNA COMMENT_COUNT DA TABELA POST
    UPDATE POST SET COMMENT_COUNT = COMMENT_COUNT + 1 WHERE ID = NEW.POST_ID;
  END IF;
  -- DELETE
  IF V_ACTION = 2 THEN
    -- VERIFICA SE É UM COMENTÁRIO PAI, SE FOR DELETA TODOS OS COMENTÁRIOS FILHOS TAMBÉM
    IF (SELECT COMMENT_PARENT FROM COMMENT WHERE ID = OLD.ID) IS NULL THEN
      UPDATE POST SET COMMENT_COUNT = COMMENT_COUNT - 1 WHERE ID = OLD.POST_ID;
      DELETE FROM COMMENT WHERE COMMENT_PARENT = OLD.ID;
    ELSE
      -- CASO NÃO SEJA UM COMENTÁRIO PAI APENAS DECREMENTA A COLUNA COMMENT_COUNT DA TABELA POST
      UPDATE POST SET COMMENT_COUNT = COMMENT_COUNT - 1 WHERE ID = OLD.POST_ID;
    END IF;
  END IF;
  IF V_ACTION IN (1,3) THEN RETURN NEW; ELSE RETURN OLD; END IF;
END; $$ LANGUAGE PLPGSQL
;
CREATE OR REPLACE TRIGGER TR_COMMENT_BRID_ BEFORE INSERT OR DELETE ON COMMENT FOR EACH ROW EXECUTE FUNCTION TR_COMMENT()
;