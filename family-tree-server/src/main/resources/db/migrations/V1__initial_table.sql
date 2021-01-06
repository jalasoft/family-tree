CREATE SEQUENCE seq_person_id START WITH 1 INCREMENT BY 1;

CREATE TABLE person(
    id INT DEFAULT NEXTVAL('seq_person_id'),
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    birth_date DATE DEFAULT NULL,
    decease_date DATE DEFAULT NULL,
    gender VARCHAR(6) NOT NULL,
    CONSTRAINT pk PRIMARY KEY (id),
    CONSTRAINT chk_gender_chk CHECK (gender='male' or gender='female')
);

CREATE SEQUENCE seq_parent_relations_id START WITH 1 INCREMENT BY 1;

CREATE TABLE parent_relations(
    id INT DEFAULT NEXTVAL('seq_parent_relations_id'),
    person_id INT,
    mother_id INT,
    father_id INT,
    CONSTRAINT pk_id PRIMARY KEY(id),
    CONSTRAINT fk_person FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE,
    CONSTRAINT fk_father FOREIGN KEY (father_id) REFERENCES person(id) ON DELETE SET NULL,
    CONSTRAINT fk_mother FOREIGN KEY (mother_id) REFERENCES person(id) ON DELETE SET NULL
);
